<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\StudentAttendance;
use App\Models\TeacherAttendance;
use App\Models\Examination;
use App\Models\ExamResult;
use App\Models\FeePayment;
use App\Models\FeeBalance;
use App\Models\BookIssue;
use App\Models\Timetable;
use App\Models\SchoolClass;
use App\Models\Programme;
use App\Helpers\BrandingHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Reports Overview/Dashboard
     */
    public function index()
    {
        $reportCategories = [
            'academic' => [
                'title' => 'Academic Reports',
                'icon' => 'fa-graduation-cap',
                'color' => 'primary',
                'reports' => [
                    ['name' => 'Student Performance Report', 'route' => 'admin.reports.student-performance', 'description' => 'Individual student academic performance'],
                    ['name' => 'Class Results Analysis', 'route' => 'admin.reports.class-results', 'description' => 'Class-wise results and statistics'],
                    ['name' => 'Subject Performance', 'route' => 'admin.reports.subject-performance', 'description' => 'Subject difficulty and pass rates'],
                    ['name' => 'Enrollment Report', 'route' => 'admin.reports.enrollment', 'description' => 'Student enrollment trends'],
                ],
            ],
            'attendance' => [
                'title' => 'Attendance Reports',
                'icon' => 'fa-calendar-check',
                'color' => 'success',
                'reports' => [
                    ['name' => 'Student Attendance Report', 'route' => 'admin.reports.student-attendance', 'description' => 'Student attendance analysis'],
                    ['name' => 'Teacher Attendance Report', 'route' => 'admin.reports.teacher-attendance', 'description' => 'Staff attendance tracking'],
                    ['name' => 'Class Attendance Summary', 'route' => 'admin.reports.class-attendance', 'description' => 'Class-wise attendance rates'],
                    ['name' => 'Absenteeism Report', 'route' => 'admin.reports.absenteeism', 'description' => 'Chronic absenteeism tracking'],
                ],
            ],
            'financial' => [
                'title' => 'Financial Reports',
                'icon' => 'fa-money-bill-wave',
                'color' => 'warning',
                'reports' => [
                    ['name' => 'Fee Collection Report', 'route' => 'admin.reports.fee-collection', 'description' => 'Revenue collection analysis'],
                    ['name' => 'Defaulters Report', 'route' => 'admin.reports.defaulters', 'description' => 'Outstanding fees tracking'],
                    ['name' => 'Payment Method Analysis', 'route' => 'admin.reports.payment-methods', 'description' => 'Payment channels breakdown'],
                    ['name' => 'Revenue Forecast', 'route' => 'admin.reports.revenue-forecast', 'description' => 'Financial projections'],
                ],
            ],
            'operational' => [
                'title' => 'Operational Reports',
                'icon' => 'fa-cogs',
                'color' => 'info',
                'reports' => [
                    ['name' => 'Library Usage Report', 'route' => 'admin.reports.library-usage', 'description' => 'Book circulation statistics'],
                    ['name' => 'Timetable Utilization', 'route' => 'admin.reports.timetable-utilization', 'description' => 'Room and teacher workload'],
                    ['name' => 'Programme Enrollment', 'route' => 'admin.reports.programme-enrollment', 'description' => 'Programme popularity analysis'],
                    ['name' => 'System Usage Report', 'route' => 'admin.reports.system-usage', 'description' => 'Platform usage statistics'],
                ],
            ],
        ];

        return view('admin.reports.index', compact('reportCategories'));
    }

    /**
     * Student Performance Report
     */
    public function studentPerformance(Request $request)
    {
        $query = ExamResult::with(['student.user', 'examination', 'subject'])
            ->whereHas('examination', function($q) use ($request) {
                if ($request->filled('academic_year')) {
                    $q->where('academic_year', $request->academic_year);
                } else {
                    $q->where('academic_year', BrandingHelper::academicYear());
                }
                
                if ($request->filled('semester')) {
                    $q->where('semester', $request->semester);
                }
            });

        if ($request->filled('programme_id')) {
            $query->whereHas('student.class', function($q) use ($request) {
                $q->where('programme_id', $request->programme_id);
            });
        }

        $results = $query->get()->groupBy('student_id');
        
        $studentData = [];
        foreach ($results as $studentId => $studentResults) {
            $student = $studentResults->first()->student;
            $totalMarks = $studentResults->sum('marks_obtained');
            $totalMaxMarks = $studentResults->sum('max_marks');
            $percentage = $totalMaxMarks > 0 ? ($totalMarks / $totalMaxMarks) * 100 : 0;
            
            $studentData[] = [
                'student' => $student,
                'total_marks' => $totalMarks,
                'total_max_marks' => $totalMaxMarks,
                'percentage' => round($percentage, 2),
                'gpa' => BrandingHelper::calculateGPA($percentage),
                'grade' => BrandingHelper::getGrade($percentage),
                'subjects_count' => $studentResults->count(),
            ];
        }

        // Sort by percentage
        usort($studentData, function($a, $b) {
            return $b['percentage'] <=> $a['percentage'];
        });

        $programmes = Programme::where('status', 'active')->get();

        return view('admin.reports.student-performance', compact('studentData', 'programmes'));
    }

    /**
     * Class Results Analysis
     */
    public function classResults(Request $request)
    {
        $classes = SchoolClass::where('status', 'active')->with('programme')->get();
        
        $classData = [];
        foreach ($classes as $class) {
            $students = Student::where('class_id', $class->id)
                ->where('student_status', 'active')
                ->pluck('id');

            $results = ExamResult::whereIn('student_id', $students)
                ->whereHas('examination', function($q) use ($request) {
                    if ($request->filled('academic_year')) {
                        $q->where('academic_year', $request->academic_year);
                    } else {
                        $q->where('academic_year', BrandingHelper::academicYear());
                    }
                })
                ->get();

            if ($results->count() > 0) {
                $totalMarks = $results->sum('marks_obtained');
                $totalMaxMarks = $results->sum('max_marks');
                $averagePercentage = $totalMaxMarks > 0 ? ($totalMarks / $totalMaxMarks) * 100 : 0;

                $classData[] = [
                    'class' => $class,
                    'students_count' => $students->count(),
                    'average_percentage' => round($averagePercentage, 2),
                    'average_gpa' => BrandingHelper::calculateGPA($averagePercentage),
                    'total_exams' => $results->count(),
                ];
            }
        }

        return view('admin.reports.class-results', compact('classData'));
    }

    /**
     * Student Attendance Report
     */
    public function studentAttendance(Request $request)
    {
        $startDate = $request->filled('start_date') ? $request->start_date : Carbon::now()->startOfMonth()->format('Y-m-d');
        $endDate = $request->filled('end_date') ? $request->end_date : Carbon::now()->format('Y-m-d');

        $query = Student::where('student_status', 'active')->with('user', 'class');

        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        $students = $query->get();
        
        $attendanceData = [];
        foreach ($students as $student) {
            $attendanceRecords = StudentAttendance::where('student_id', $student->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->get();

            $totalDays = $attendanceRecords->count();
            $presentDays = $attendanceRecords->whereIn('status', ['present', 'late'])->count();
            $percentage = $totalDays > 0 ? ($presentDays / $totalDays) * 100 : 0;

            $attendanceData[] = [
                'student' => $student,
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'absent_days' => $attendanceRecords->where('status', 'absent')->count(),
                'late_days' => $attendanceRecords->where('status', 'late')->count(),
                'percentage' => round($percentage, 2),
            ];
        }

        $classes = SchoolClass::where('status', 'active')->get();

        return view('admin.reports.student-attendance', compact('attendanceData', 'classes', 'startDate', 'endDate'));
    }

    /**
     * Fee Collection Report
     */
    public function feeCollection(Request $request)
    {
        $startDate = $request->filled('start_date') ? $request->start_date : Carbon::now()->startOfMonth()->format('Y-m-d');
        $endDate = $request->filled('end_date') ? $request->end_date : Carbon::now()->format('Y-m-d');

        $payments = FeePayment::whereBetween('payment_date', [$startDate, $endDate])
            ->with('student.user')
            ->get();

        $totalCollected = $payments->sum('amount_paid');
        $paymentsByMethod = $payments->groupBy('payment_method');
        $paymentsByDate = $payments->groupBy(function($payment) {
            return Carbon::parse($payment->payment_date)->format('Y-m-d');
        });

        $methodStats = [];
        foreach ($paymentsByMethod as $method => $methodPayments) {
            $methodStats[] = [
                'method' => ucfirst($method),
                'count' => $methodPayments->count(),
                'amount' => $methodPayments->sum('amount_paid'),
                'percentage' => $totalCollected > 0 ? round(($methodPayments->sum('amount_paid') / $totalCollected) * 100, 2) : 0,
            ];
        }

        $dailyCollections = [];
        foreach ($paymentsByDate as $date => $datePayments) {
            $dailyCollections[] = [
                'date' => $date,
                'count' => $datePayments->count(),
                'amount' => $datePayments->sum('amount_paid'),
            ];
        }

        return view('admin.reports.fee-collection', compact('payments', 'totalCollected', 'methodStats', 'dailyCollections', 'startDate', 'endDate'));
    }

    /**
     * Defaulters Report
     */
    public function defaulters(Request $request)
    {
        $query = FeeBalance::where('balance_amount', '>', 0)
            ->where('academic_year', BrandingHelper::academicYear())
            ->with('student.user', 'student.class');

        if ($request->filled('min_balance')) {
            $query->where('balance_amount', '>=', $request->min_balance);
        }

        $defaulters = $query->orderBy('balance_amount', 'desc')->get();

        $totalOutstanding = $defaulters->sum('balance_amount');
        $averageBalance = $defaulters->avg('balance_amount');

        $stats = [
            'total_defaulters' => $defaulters->count(),
            'total_outstanding' => $totalOutstanding,
            'average_balance' => round($averageBalance, 2),
        ];

        return view('admin.reports.defaulters', compact('defaulters', 'stats'));
    }

    /**
     * Library Usage Report
     */
    public function libraryUsage(Request $request)
    {
        $startDate = $request->filled('start_date') ? $request->start_date : Carbon::now()->startOfMonth()->format('Y-m-d');
        $endDate = $request->filled('end_date') ? $request->end_date : Carbon::now()->format('Y-m-d');

        $bookIssues = BookIssue::whereBetween('issue_date', [$startDate, $endDate])
            ->with('book', 'student.user')
            ->get();

        $totalIssues = $bookIssues->count();
        $totalReturned = $bookIssues->where('status', 'returned')->count();
        $totalOverdue = $bookIssues->where('status', 'issued')
            ->filter(function($issue) {
                return $issue->return_date && Carbon::parse($issue->return_date)->isPast();
            })->count();

        $popularBooks = $bookIssues->groupBy('book_id')
            ->map(function($issues) {
                return [
                    'book' => $issues->first()->book,
                    'issues_count' => $issues->count(),
                ];
            })
            ->sortByDesc('issues_count')
            ->take(10);

        $stats = [
            'total_issues' => $totalIssues,
            'total_returned' => $totalReturned,
            'total_overdue' => $totalOverdue,
            'return_rate' => $totalIssues > 0 ? round(($totalReturned / $totalIssues) * 100, 2) : 0,
        ];

        return view('admin.reports.library-usage', compact('bookIssues', 'stats', 'popularBooks', 'startDate', 'endDate'));
    }

    /**
     * Teacher Attendance Report
     */
    public function teacherAttendance(Request $request)
    {
        $startDate = $request->filled('start_date') ? $request->start_date : Carbon::now()->startOfMonth()->format('Y-m-d');
        $endDate = $request->filled('end_date') ? $request->end_date : Carbon::now()->format('Y-m-d');

        $teachers = Teacher::where('teacher_status', 'active')->with('user', 'department')->get();
        
        $attendanceData = [];
        foreach ($teachers as $teacher) {
            $attendanceRecords = TeacherAttendance::where('teacher_id', $teacher->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->get();

            $totalDays = $attendanceRecords->count();
            $presentDays = $attendanceRecords->whereIn('status', ['present', 'late'])->count();
            $percentage = $totalDays > 0 ? ($presentDays / $totalDays) * 100 : 0;

            $attendanceData[] = [
                'teacher' => $teacher,
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'absent_days' => $attendanceRecords->where('status', 'absent')->count(),
                'late_days' => $attendanceRecords->where('status', 'late')->count(),
                'percentage' => round($percentage, 2),
            ];
        }

        return view('admin.reports.teacher-attendance', compact('attendanceData', 'startDate', 'endDate'));
    }

    /**
     * Timetable Utilization Report
     */
    public function timetableUtilization()
    {
        $academicYear = BrandingHelper::academicYear();
        
        // Teacher workload
        $teachers = Teacher::where('teacher_status', 'active')->with('user')->get();
        $teacherWorkload = [];
        
        foreach ($teachers as $teacher) {
            $schedules = Timetable::where('teacher_id', $teacher->id)
                ->where('academic_year', $academicYear)
                ->where('status', 'active')
                ->count();

            $teacherWorkload[] = [
                'teacher' => $teacher,
                'total_schedules' => $schedules,
            ];
        }

        // Sort by workload
        usort($teacherWorkload, function($a, $b) {
            return $b['total_schedules'] <=> $a['total_schedules'];
        });

        return view('admin.reports.timetable-utilization', compact('teacherWorkload'));
    }

    /**
     * Enrollment Report
     */
    public function enrollment(Request $request)
    {
        $academicYear = $request->filled('academic_year') ? $request->academic_year : BrandingHelper::academicYear();

        $programmes = Programme::where('status', 'active')->get();
        $enrollmentData = [];

        foreach ($programmes as $programme) {
            $classes = SchoolClass::where('programme_id', $programme->id)->pluck('id');
            $studentCount = Student::whereIn('class_id', $classes)
                ->where('student_status', 'active')
                ->count();

            $enrollmentData[] = [
                'programme' => $programme,
                'student_count' => $studentCount,
            ];
        }

        // Sort by enrollment
        usort($enrollmentData, function($a, $b) {
            return $b['student_count'] <=> $a['student_count'];
        });

        $totalEnrollment = array_sum(array_column($enrollmentData, 'student_count'));

        return view('admin.reports.enrollment', compact('enrollmentData', 'totalEnrollment', 'academicYear'));
    }

    /**
     * Export Report to PDF (placeholder - requires PDF library)
     */
    public function exportPDF(Request $request)
    {
        $reportType = $request->input('report_type');
        
        // This would use a PDF library like dompdf or wkhtmltopdf
        // For now, return a message
        
        return redirect()->back()
            ->with('info', 'PDF export functionality will be available soon. Please use the print option in your browser.');
    }

    /**
     * Export Report to Excel (placeholder - requires Excel library)
     */
    public function exportExcel(Request $request)
    {
        $reportType = $request->input('report_type');
        
        // This would use maatwebsite/excel package
        // For now, return a message
        
        return redirect()->back()
            ->with('info', 'Excel export functionality will be available soon.');
    }
}
