<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StudentAttendance;
use App\Models\TeacherAttendance;
use App\Models\QrAttendanceSession;
use App\Models\QrAttendanceLog;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AttendanceController extends Controller
{
    /**
     * Display attendance dashboard
     */
    public function index(Request $request)
    {
        $query = StudentAttendance::with('student.user', 'class', 'subject');

        // Filters
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('attendance_date', $request->date);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest('attendance_date')->paginate(50);
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();

        // Statistics
        $today = today();
        $stats = [
            'today_present' => StudentAttendance::whereDate('attendance_date', $today)
                ->where('status', 'present')->count(),
            'today_absent' => StudentAttendance::whereDate('attendance_date', $today)
                ->where('status', 'absent')->count(),
            'today_late' => StudentAttendance::whereDate('attendance_date', $today)
                ->where('status', 'late')->count(),
            'total_students' => Student::where('student_status', 'active')->count(),
        ];

        return view('admin.attendance.index', compact('attendances', 'classes', 'subjects', 'stats'));
    }

    /**
     * Show form for marking attendance
     */
    public function mark(Request $request)
    {
        $classes = SchoolClass::where('status', 'active')
            ->with(['students.user'])
            ->orderBy('name')
            ->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();

        $selectedClass = null;
        $students = collect();

        if ($request->filled('class_id')) {
            $selectedClass = SchoolClass::with(['students.user'])->find($request->class_id);
            $students = $selectedClass->students ?? collect();
        }

        return view('admin.attendance.mark', compact('classes', 'subjects', 'selectedClass', 'students'));
    }

    /**
     * Store attendance records
     */
    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'attendance_date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:present,absent,late,excused',
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->attendances as $attendance) {
                StudentAttendance::updateOrCreate(
                    [
                        'student_id' => $attendance['student_id'],
                        'attendance_date' => $request->attendance_date,
                        'subject_id' => $request->subject_id,
                    ],
                    [
                        'class_id' => $request->class_id,
                        'status' => $attendance['status'],
                        'remarks' => $attendance['remarks'] ?? null,
                        'marked_by' => auth()->id(),
                    ]
                );
            }

            DB::commit();
            return redirect()->route('admin.attendance.index')
                ->with('success', 'Attendance marked successfully for ' . count($request->attendances) . ' students.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to mark attendance: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Generate attendance report
     */
    public function report(Request $request)
    {
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $students = collect();
        $attendanceData = [];
        $summary = null;

        if ($request->filled('class_id') && $request->filled('start_date') && $request->filled('end_date')) {
            $students = Student::where('class_id', $request->class_id)
                ->with('user')
                ->get();

            $startDate = $request->start_date;
            $endDate = $request->end_date;

            foreach ($students as $student) {
                $records = StudentAttendance::where('student_id', $student->id)
                    ->whereBetween('attendance_date', [$startDate, $endDate])
                    ->get();

                $total = $records->count();
                $present = $records->where('status', 'present')->count();
                $absent = $records->where('status', 'absent')->count();
                $late = $records->where('status', 'late')->count();
                $excused = $records->where('status', 'excused')->count();

                $attendanceData[$student->id] = [
                    'total' => $total,
                    'present' => $present,
                    'absent' => $absent,
                    'late' => $late,
                    'excused' => $excused,
                    'percentage' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
                ];
            }

            // Summary statistics
            $summary = [
                'total_records' => array_sum(array_column($attendanceData, 'total')),
                'total_present' => array_sum(array_column($attendanceData, 'present')),
                'total_absent' => array_sum(array_column($attendanceData, 'absent')),
                'total_late' => array_sum(array_column($attendanceData, 'late')),
                'avg_percentage' => $students->count() > 0 
                    ? round(array_sum(array_column($attendanceData, 'percentage')) / $students->count(), 2) 
                    : 0,
            ];
        }

        return view('admin.attendance.report', compact('classes', 'students', 'attendanceData', 'summary'));
    }

    /**
     * QR Code Attendance - Create Session
     */
    public function qrCreate()
    {
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        $teachers = Teacher::with('user')->where('teacher_status', 'active')->get();

        return view('admin.attendance.qr-create', compact('classes', 'subjects', 'teachers'));
    }

    /**
     * Store QR Attendance Session
     */
    public function qrStore(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'nullable|exists:subjects,id',
            'teacher_id' => 'required|exists:teachers,id',
            'session_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'nullable|after:start_time',
        ]);

        // Generate unique session code
        $sessionCode = Str::upper(Str::random(8));

        $session = QrAttendanceSession::create([
            'class_id' => $request->class_id,
            'subject_id' => $request->subject_id,
            'teacher_id' => $request->teacher_id,
            'session_code' => $sessionCode,
            'session_date' => $request->session_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => 'active',
        ]);

        return redirect()->route('admin.attendance.qr.show', $session)
            ->with('success', 'QR Attendance session created successfully.');
    }

    /**
     * Display QR Code for scanning
     */
    public function qrShow(QrAttendanceSession $session)
    {
        $session->load(['class', 'subject', 'teacher.user']);
        
        // Generate QR code URL
        $qrUrl = route('attendance.qr.scan', ['code' => $session->session_code]);
        
        // Get scan logs
        $logs = $session->logs()->with('student.user')->latest()->get();

        return view('admin.attendance.qr-show', compact('session', 'qrUrl', 'logs'));
    }

    /**
     * Close QR Attendance Session
     */
    public function qrClose(QrAttendanceSession $session)
    {
        $session->update([
            'status' => 'closed',
            'end_time' => now()->format('H:i:s'),
        ]);

        // Create regular attendance records from QR logs
        $logs = $session->logs()->get();
        
        foreach ($logs as $log) {
            StudentAttendance::updateOrCreate(
                [
                    'student_id' => $log->student_id,
                    'attendance_date' => $session->session_date,
                    'subject_id' => $session->subject_id,
                ],
                [
                    'class_id' => $session->class_id,
                    'status' => $log->status,
                    'remarks' => 'Via QR Code Scan',
                    'marked_by' => $session->teacher->user_id,
                ]
            );
        }

        return redirect()->route('admin.attendance.qr.sessions')
            ->with('success', 'Session closed and attendance recorded for ' . $logs->count() . ' students.');
    }

    /**
     * List all QR sessions
     */
    public function qrSessions(Request $request)
    {
        $query = QrAttendanceSession::with(['class', 'subject', 'teacher.user']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        $sessions = $query->latest('session_date')->paginate(20);
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();

        return view('admin.attendance.qr-sessions', compact('sessions', 'classes'));
    }

    /**
     * Teacher Attendance Management
     */
    public function teacherIndex(Request $request)
    {
        $query = TeacherAttendance::with('teacher.user');

        if ($request->filled('date')) {
            $query->whereDate('attendance_date', $request->date);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $attendances = $query->latest('attendance_date')->paginate(50);

        // Today's statistics
        $today = today();
        $stats = [
            'present' => TeacherAttendance::whereDate('attendance_date', $today)
                ->where('status', 'present')->count(),
            'absent' => TeacherAttendance::whereDate('attendance_date', $today)
                ->where('status', 'absent')->count(),
            'on_leave' => TeacherAttendance::whereDate('attendance_date', $today)
                ->where('status', 'on_leave')->count(),
            'total_teachers' => Teacher::where('teacher_status', 'active')->count(),
        ];

        return view('admin.attendance.teacher-index', compact('attendances', 'stats'));
    }

    /**
     * Mark teacher attendance
     */
    public function teacherMark()
    {
        $teachers = Teacher::with('user')
            ->where('teacher_status', 'active')
            ->orderBy('staff_id')
            ->get();

        $date = request('date', today()->toDateString());

        // Get existing attendance for the date
        $existing = TeacherAttendance::whereDate('attendance_date', $date)
            ->pluck('status', 'teacher_id')
            ->toArray();

        return view('admin.attendance.teacher-mark', compact('teachers', 'date', 'existing'));
    }

    /**
     * Store teacher attendance
     */
    public function teacherStore(Request $request)
    {
        $request->validate([
            'attendance_date' => 'required|date',
            'attendances' => 'required|array',
            'attendances.*.teacher_id' => 'required|exists:teachers,id',
            'attendances.*.status' => 'required|in:present,absent,half_day,on_leave',
            'attendances.*.check_in_time' => 'nullable',
            'attendances.*.check_out_time' => 'nullable',
        ]);

        DB::beginTransaction();
        try {
            foreach ($request->attendances as $attendance) {
                TeacherAttendance::updateOrCreate(
                    [
                        'teacher_id' => $attendance['teacher_id'],
                        'attendance_date' => $request->attendance_date,
                    ],
                    [
                        'check_in_time' => $attendance['check_in_time'] ?? null,
                        'check_out_time' => $attendance['check_out_time'] ?? null,
                        'status' => $attendance['status'],
                        'remarks' => $attendance['remarks'] ?? null,
                    ]
                );
            }

            DB::commit();
            return redirect()->route('admin.attendance.teacher.index')
                ->with('success', 'Teacher attendance marked successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to mark teacher attendance: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Export attendance data
     */
    public function export(Request $request)
    {
        // This would integrate with Excel export
        // For now, return a JSON response
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $attendances = StudentAttendance::with(['student.user', 'class', 'subject'])
            ->where('class_id', $request->class_id)
            ->whereBetween('attendance_date', [$request->start_date, $request->end_date])
            ->get();

        // Return as downloadable CSV or Excel
        return response()->json([
            'message' => 'Export functionality to be implemented',
            'data' => $attendances
        ]);
    }

    /**
     * Get students for a class (AJAX)
     */
    public function getClassStudents(Request $request, $classId)
    {
        $students = Student::where('class_id', $classId)
            ->with('user')
            ->where('student_status', 'active')
            ->orderBy('admission_number')
            ->get()
            ->map(function($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->first_name . ' ' . $student->user->last_name,
                    'admission_number' => $student->admission_number,
                ];
            });

        return response()->json($students);
    }
}
