<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\SchoolClass;
use App\Models\Department;
use App\Models\Programme;
use App\Models\Subject;
use App\Models\Announcement;
use App\Models\FeePayment;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard based on user role.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('administrator') || $user->hasRole('director')) {
            return $this->adminDashboard();
        }

        if ($user->hasRole('dean') || $user->hasRole('hod')) {
            return $this->academicDashboard();
        }

        if ($user->hasRole('teacher')) {
            return $this->teacherDashboard();
        }

        if ($user->hasRole('bursar')) {
            return $this->bursarDashboard();
        }

        if ($user->hasRole('librarian')) {
            return $this->librarianDashboard();
        }

        if ($user->hasRole('student')) {
            return $this->studentDashboard();
        }

        return view('dashboard.default');
    }

    /**
     * Admin/Director Dashboard
     */
    protected function adminDashboard()
    {
        $data = [
            'totalStudents' => Student::active()->count(),
            'totalTeachers' => Teacher::active()->count(),
            'totalClasses' => SchoolClass::active()->count(),
            'totalDepartments' => Department::active()->count(),
            'totalProgrammes' => Programme::active()->count(),
            'totalSubjects' => Subject::active()->count(),
            
            // Today's stats
            'todayAttendance' => StudentAttendance::byDate(Carbon::today())
                ->where('status', 'present')
                ->count(),
            'todayAbsent' => StudentAttendance::byDate(Carbon::today())
                ->where('status', 'absent')
                ->count(),
            
            // Financial stats
            'monthlyRevenue' => FeePayment::completed()
                ->whereMonth('payment_date', Carbon::now()->month)
                ->sum('amount_paid'),
            'totalRevenue' => FeePayment::completed()->sum('amount_paid'),
            
            // Recent data
            'recentStudents' => Student::with('user', 'programme')
                ->latest()
                ->take(5)
                ->get(),
            'recentAnnouncements' => Announcement::published()
                ->with('postedBy')
                ->latest()
                ->take(5)
                ->get(),
            
            // Charts data
            'studentsByProgramme' => Programme::withCount('students')->get(),
            'monthlyPayments' => $this->getMonthlyPayments(),
        ];

        return view('dashboard.admin', $data);
    }

    /**
     * Academic Dashboard (Dean/HOD)
     */
    protected function academicDashboard()
    {
        $user = auth()->user();
        $departmentId = $user->teacher?->department_id;

        $data = [
            'totalClasses' => SchoolClass::active()->count(),
            'totalSubjects' => Subject::active()->count(),
            'totalStudents' => Student::active()->count(),
            'totalTeachers' => Teacher::active()->count(),
            
            // Attendance summary
            'todayAttendanceRate' => $this->calculateAttendanceRate(Carbon::today()),
            'weeklyAttendanceRate' => $this->calculateAttendanceRate(Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()),
            
            // Recent activities
            'recentClasses' => SchoolClass::with('programme', 'classTeacher')
                ->active()
                ->latest()
                ->take(5)
                ->get(),
            'announcements' => Announcement::published()->latest()->take(5)->get(),
        ];

        return view('dashboard.academic', $data);
    }

    /**
     * Teacher Dashboard
     */
    protected function teacherDashboard()
    {
        $user = auth()->user();
        $teacher = $user->teacher;

        if (!$teacher) {
            return redirect()->route('dashboard')->with('error', 'Teacher profile not found.');
        }

        $data = [
            'teacher' => $teacher->load('department', 'subjects', 'classesAsClassTeacher'),
            'myClasses' => $teacher->classesAsClassTeacher()->with('programme')->get(),
            'mySubjects' => $teacher->subjects()->with('department')->get(),
            'todayClasses' => $teacher->timetables()
                ->with('class', 'subject', 'room')
                ->byDay(strtolower(Carbon::now()->format('l')))
                ->active()
                ->orderBy('start_time')
                ->get(),
            'announcements' => Announcement::published()
                ->whereIn('target_audience', ['all', 'teachers'])
                ->latest()
                ->take(5)
                ->get(),
        ];

        return view('dashboard.teacher', $data);
    }

    /**
     * Bursar Dashboard
     */
    protected function bursarDashboard()
    {
        $data = [
            'todayCollection' => FeePayment::completed()
                ->whereDate('payment_date', Carbon::today())
                ->sum('amount_paid'),
            'weeklyCollection' => FeePayment::completed()
                ->whereBetween('payment_date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                ->sum('amount_paid'),
            'monthlyCollection' => FeePayment::completed()
                ->whereMonth('payment_date', Carbon::now()->month)
                ->sum('amount_paid'),
            'totalCollection' => FeePayment::completed()->sum('amount_paid'),
            
            'recentPayments' => FeePayment::with('student.user', 'feeStructure')
                ->completed()
                ->latest()
                ->take(10)
                ->get(),
            
            'paymentMethods' => FeePayment::completed()
                ->selectRaw('payment_method, COUNT(*) as count, SUM(amount_paid) as total')
                ->groupBy('payment_method')
                ->get(),
                
            'monthlyPayments' => $this->getMonthlyPayments(),
        ];

        return view('dashboard.bursar', $data);
    }

    /**
     * Librarian Dashboard
     */
    protected function librarianDashboard()
    {
        $data = [
            'totalBooks' => \App\Models\Book::count(),
            'availableBooks' => \App\Models\Book::available()->count(),
            'issuedBooks' => \App\Models\BookIssue::issued()->count(),
            'overdueBooks' => \App\Models\BookIssue::overdue()->count(),
            
            'recentIssues' => \App\Models\BookIssue::with('book', 'student.user')
                ->latest()
                ->take(10)
                ->get(),
            
            'overdueIssues' => \App\Models\BookIssue::overdue()
                ->with('book', 'student.user')
                ->get(),
        ];

        return view('dashboard.librarian', $data);
    }

    /**
     * Student Dashboard
     */
    protected function studentDashboard()
    {
        $user = auth()->user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('dashboard')->with('error', 'Student profile not found.');
        }

        $data = [
            'student' => $student->load('programme', 'class'),
            'attendanceRate' => $student->getAttendancePercentage(Carbon::now()->startOfMonth(), Carbon::now()),
            'feeBalance' => $student->getCurrentBalance(Carbon::now()->year),
            'recentResults' => $student->examResults()
                ->with('examination.subject')
                ->latest()
                ->take(5)
                ->get(),
            'timetable' => $student->class?->timetables()
                ->with('subject', 'teacher.user', 'room')
                ->active()
                ->orderBy('day_of_week')
                ->orderBy('start_time')
                ->get(),
            'announcements' => Announcement::published()
                ->where(function ($q) use ($student) {
                    $q->where('target_audience', 'all')
                      ->orWhere('target_audience', 'students')
                      ->orWhere('class_id', $student->class_id);
                })
                ->latest()
                ->take(5)
                ->get(),
            'borrowedBooks' => $student->bookIssues()
                ->issued()
                ->with('book')
                ->get(),
        ];

        return view('dashboard.student', $data);
    }

    /**
     * Calculate attendance rate.
     */
    protected function calculateAttendanceRate($startDate, $endDate = null)
    {
        $query = StudentAttendance::query();

        if ($endDate) {
            $query->byDateRange($startDate, $endDate);
        } else {
            $query->byDate($startDate);
        }

        $total = $query->count();
        if ($total === 0) return 0;

        $present = $query->where('status', 'present')->count();
        return round(($present / $total) * 100, 2);
    }

    /**
     * Get monthly payments for the last 12 months.
     */
    protected function getMonthlyPayments()
    {
        $payments = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $payments[] = [
                'month' => $date->format('M Y'),
                'amount' => FeePayment::completed()
                    ->whereYear('payment_date', $date->year)
                    ->whereMonth('payment_date', $date->month)
                    ->sum('amount_paid')
            ];
        }
        return $payments;
    }
}
