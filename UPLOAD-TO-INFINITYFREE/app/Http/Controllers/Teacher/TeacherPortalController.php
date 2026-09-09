<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\TeacherAttendance;
use App\Models\Timetable;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\StudentAttendance;
use App\Models\Examination;
use App\Models\ExamResult;
use App\Models\Announcement;
use App\Helpers\BrandingHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TeacherPortalController extends Controller
{
    /**
     * Teacher dashboard
     */
    public function dashboard()
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        // Statistics
        $stats = [
            'classes_assigned' => $this->getClassesAssigned($teacher),
            'students_count' => $this->getTotalStudents($teacher),
            'attendance_today' => $this->getAttendanceToday($teacher),
            'pending_marks' => $this->getPendingMarksEntry($teacher),
        ];

        // Today's schedule
        $today = strtolower(Carbon::now()->format('l'));
        $todaySchedule = Timetable::where('teacher_id', $teacher->id)
            ->where('day_of_week', $today)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['class', 'subject', 'room'])
            ->orderBy('start_time')
            ->get();

        // Recent attendance records
        $recentAttendance = TeacherAttendance::where('teacher_id', $teacher->id)
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();

        // Upcoming exams
        $upcomingExams = Examination::where('class_id', $teacher->class_id)
            ->where('exam_date', '>=', Carbon::now())
            ->where('status', 'scheduled')
            ->orderBy('exam_date')
            ->limit(5)
            ->get();

        // Announcements
        $announcements = Announcement::where('status', 'published')
            ->where(function($query) {
                $query->where('target_audience', 'all')
                      ->orWhere('target_audience', 'teachers');
            })
            ->orderBy('published_at', 'desc')
            ->limit(5)
            ->get();

        return view('teacher.dashboard', compact(
            'teacher',
            'stats',
            'todaySchedule',
            'recentAttendance',
            'upcomingExams',
            'announcements'
        ));
    }

    /**
     * View teacher profile
     */
    public function profile()
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        $teacher->load(['user', 'department']);

        return view('teacher.profile', compact('teacher'));
    }

    /**
     * View teaching timetable
     */
    public function timetable()
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        $timetables = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['class', 'subject', 'room'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        return view('teacher.timetable', compact('teacher', 'timetables', 'days'));
    }

    /**
     * View assigned classes
     */
    public function classes()
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        // Get classes from timetable
        $classIds = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->distinct()
            ->pluck('class_id');

        $classes = SchoolClass::whereIn('id', $classIds)
            ->with(['programme'])
            ->withCount('students')
            ->get();

        return view('teacher.classes', compact('classes', 'teacher'));
    }

    /**
     * View class students
     */
    public function classStudents(SchoolClass $class)
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        // Verify teacher teaches this class
        $teachesClass = Timetable::where('teacher_id', $teacher->id)
            ->where('class_id', $class->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->exists();

        if (!$teachesClass) {
            abort(403, 'You do not teach this class.');
        }

        $students = Student::where('class_id', $class->id)
            ->where('student_status', 'active')
            ->with('user')
            ->orderBy('admission_number')
            ->get();

        return view('teacher.class-students', compact('class', 'students', 'teacher'));
    }

    /**
     * View student attendance for marking
     */
    public function markAttendance(Request $request)
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        // Get classes taught by teacher
        $classIds = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->distinct()
            ->pluck('class_id');

        $classes = SchoolClass::whereIn('id', $classIds)->get();

        $students = [];
        $selectedClass = null;
        $attendanceDate = $request->filled('date') ? $request->date : Carbon::now()->format('Y-m-d');

        if ($request->filled('class_id')) {
            $selectedClass = SchoolClass::find($request->class_id);
            
            $students = Student::where('class_id', $request->class_id)
                ->where('student_status', 'active')
                ->with(['user'])
                ->orderBy('admission_number')
                ->get();

            // Get existing attendance for the date
            $existingAttendance = StudentAttendance::where('class_id', $request->class_id)
                ->where('date', $attendanceDate)
                ->pluck('status', 'student_id');

            foreach ($students as $student) {
                $student->attendance_status = $existingAttendance->get($student->id, null);
            }
        }

        return view('teacher.mark-attendance', compact(
            'classes',
            'students',
            'selectedClass',
            'attendanceDate',
            'teacher'
        ));
    }

    /**
     * Store attendance
     */
    public function storeAttendance(Request $request)
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*' => 'required|in:present,absent,late,excused',
        ]);

        // Verify teacher teaches this class
        $teachesClass = Timetable::where('teacher_id', $teacher->id)
            ->where('class_id', $validated['class_id'])
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->exists();

        if (!$teachesClass) {
            return redirect()->back()->with('error', 'You do not teach this class.');
        }

        foreach ($validated['attendance'] as $studentId => $status) {
            StudentAttendance::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'class_id' => $validated['class_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $status,
                    'marked_by' => Auth::id(),
                ]
            );
        }

        return redirect()->route('teacher.attendance.mark')
            ->with('success', 'Attendance marked successfully.');
    }

    /**
     * View exams for marks entry
     */
    public function exams()
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        // Get classes taught by teacher
        $classIds = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->distinct()
            ->pluck('class_id');

        $exams = Examination::whereIn('class_id', $classIds)
            ->with(['class', 'subject'])
            ->orderBy('exam_date', 'desc')
            ->paginate(20);

        return view('teacher.exams', compact('exams', 'teacher'));
    }

    /**
     * Enter marks for exam
     */
    public function enterMarks(Examination $examination)
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        // Verify teacher teaches this class
        $teachesClass = Timetable::where('teacher_id', $teacher->id)
            ->where('class_id', $examination->class_id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->exists();

        if (!$teachesClass) {
            abort(403, 'You do not teach this class.');
        }

        $students = Student::where('class_id', $examination->class_id)
            ->where('student_status', 'active')
            ->with('user')
            ->orderBy('admission_number')
            ->get();

        // Get existing results
        $existingResults = ExamResult::where('examination_id', $examination->id)
            ->pluck('marks_obtained', 'student_id');

        foreach ($students as $student) {
            $student->marks = $existingResults->get($student->id, null);
        }

        return view('teacher.enter-marks', compact('examination', 'students', 'teacher'));
    }

    /**
     * Store exam marks
     */
    public function storeMarks(Request $request, Examination $examination)
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        $validated = $request->validate([
            'marks' => 'required|array',
            'marks.*' => 'nullable|numeric|min:0|max:' . $examination->max_marks,
        ]);

        foreach ($validated['marks'] as $studentId => $marks) {
            if ($marks !== null) {
                $percentage = ($marks / $examination->max_marks) * 100;
                $grade = BrandingHelper::getGrade($percentage);

                ExamResult::updateOrCreate(
                    [
                        'examination_id' => $examination->id,
                        'student_id' => $studentId,
                        'subject_id' => $examination->subject_id,
                    ],
                    [
                        'marks_obtained' => $marks,
                        'max_marks' => $examination->max_marks,
                        'grade' => $grade,
                        'remarks' => BrandingHelper::getGradeRemark($percentage),
                    ]
                );
            }
        }

        return redirect()->route('teacher.exams')
            ->with('success', 'Marks entered successfully.');
    }

    /**
     * View own attendance records
     */
    public function myAttendance(Request $request)
    {
        $teacher = $this->getAuthenticatedTeacher();

        if (!$teacher) {
            return redirect()->route('login')->with('error', 'Teacher record not found.');
        }

        $query = TeacherAttendance::where('teacher_id', $teacher->id);

        // Filter by month
        if ($request->filled('month')) {
            $month = Carbon::parse($request->month);
            $query->whereYear('date', $month->year)
                  ->whereMonth('date', $month->month);
        } else {
            // Default to current month
            $query->whereYear('date', Carbon::now()->year)
                  ->whereMonth('date', Carbon::now()->month);
        }

        $attendanceRecords = $query->orderBy('date', 'desc')->get();

        // Calculate statistics
        $totalDays = $attendanceRecords->count();
        $presentDays = $attendanceRecords->where('status', 'present')->count();
        $lateDays = $attendanceRecords->where('status', 'late')->count();
        $absentDays = $attendanceRecords->where('status', 'absent')->count();

        $attendancePercentage = $totalDays > 0 
            ? round((($presentDays + $lateDays) / $totalDays) * 100, 2)
            : 0;

        $stats = [
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'late_days' => $lateDays,
            'absent_days' => $absentDays,
            'attendance_percentage' => $attendancePercentage,
        ];

        return view('teacher.my-attendance', compact('attendanceRecords', 'stats'));
    }

    /**
     * View announcements
     */
    public function announcements()
    {
        $announcements = Announcement::where('status', 'published')
            ->where(function($query) {
                $query->where('target_audience', 'all')
                      ->orWhere('target_audience', 'teachers');
            })
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return view('teacher.announcements', compact('announcements'));
    }

    /**
     * View single announcement
     */
    public function viewAnnouncement(Announcement $announcement)
    {
        if ($announcement->status !== 'published') {
            abort(404);
        }

        if (!in_array($announcement->target_audience, ['all', 'teachers'])) {
            abort(403);
        }

        return view('teacher.announcement-detail', compact('announcement'));
    }

    /**
     * Helper: Get authenticated teacher
     */
    private function getAuthenticatedTeacher()
    {
        $user = Auth::user();
        return Teacher::where('user_id', $user->id)->with(['user', 'department'])->first();
    }

    /**
     * Helper: Get classes assigned count
     */
    private function getClassesAssigned($teacher)
    {
        return Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->distinct('class_id')
            ->count('class_id');
    }

    /**
     * Helper: Get total students taught
     */
    private function getTotalStudents($teacher)
    {
        $classIds = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->distinct()
            ->pluck('class_id');

        return Student::whereIn('class_id', $classIds)
            ->where('student_status', 'active')
            ->count();
    }

    /**
     * Helper: Check if attended today
     */
    private function getAttendanceToday($teacher)
    {
        $today = TeacherAttendance::where('teacher_id', $teacher->id)
            ->where('date', Carbon::now()->format('Y-m-d'))
            ->first();

        return $today ? $today->status : 'not_marked';
    }

    /**
     * Helper: Get pending marks entry count
     */
    private function getPendingMarksEntry($teacher)
    {
        $classIds = Timetable::where('teacher_id', $teacher->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->distinct()
            ->pluck('class_id');

        $completedExams = Examination::whereIn('class_id', $classIds)
            ->where('status', 'completed')
            ->pluck('id');

        $marksEntered = ExamResult::whereIn('examination_id', $completedExams)
            ->distinct('examination_id')
            ->pluck('examination_id');

        return $completedExams->diff($marksEntered)->count();
    }
}
