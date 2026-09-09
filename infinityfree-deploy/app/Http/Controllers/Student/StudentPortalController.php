<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentAttendance;
use App\Models\ExamResult;
use App\Models\FeeBalance;
use App\Models\FeePayment;
use App\Models\Timetable;
use App\Models\BookIssue;
use App\Models\Announcement;
use App\Helpers\BrandingHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class StudentPortalController extends Controller
{
    /**
     * Student dashboard
     */
    public function dashboard()
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        // Statistics
        $stats = [
            'attendance_percentage' => $this->getAttendancePercentage($student),
            'pending_fees' => $this->getPendingFees($student),
            'current_gpa' => $this->getCurrentGPA($student),
            'books_issued' => $this->getBooksIssued($student),
        ];

        // Recent activity
        $recentAttendance = StudentAttendance::where('student_id', $student->id)
            ->with('class')
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        $recentPayments = FeePayment::where('student_id', $student->id)
            ->orderBy('payment_date', 'desc')
            ->limit(5)
            ->get();

        // Upcoming events (from announcements)
        $announcements = Announcement::where('status', 'published')
            ->where(function($query) {
                $query->where('target_audience', 'all')
                      ->orWhere('target_audience', 'students');
            })
            ->orderBy('published_at', 'desc')
            ->limit(5)
            ->get();

        // Today's timetable
        $today = strtolower(Carbon::now()->format('l'));
        $todaySchedule = Timetable::where('class_id', $student->class_id)
            ->where('day_of_week', $today)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['subject', 'teacher.user', 'room'])
            ->orderBy('start_time')
            ->get();

        return view('student.dashboard', compact(
            'student',
            'stats',
            'recentAttendance',
            'recentPayments',
            'announcements',
            'todaySchedule'
        ));
    }

    /**
     * View student profile
     */
    public function profile()
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        $student->load(['class.programme', 'user']);

        return view('student.profile', compact('student'));
    }

    /**
     * View attendance records
     */
    public function attendance(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        $query = StudentAttendance::where('student_id', $student->id)
            ->with('class');

        // Filters
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
        $excusedDays = $attendanceRecords->where('status', 'excused')->count();

        $attendancePercentage = $totalDays > 0 
            ? round((($presentDays + $lateDays) / $totalDays) * 100, 2)
            : 0;

        $stats = [
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'late_days' => $lateDays,
            'absent_days' => $absentDays,
            'excused_days' => $excusedDays,
            'attendance_percentage' => $attendancePercentage,
        ];

        return view('student.attendance', compact('attendanceRecords', 'stats'));
    }

    /**
     * View exam results
     */
    public function examResults(Request $request)
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        $query = ExamResult::where('student_id', $student->id)
            ->with(['examination', 'subject']);

        // Filter by academic year
        if ($request->filled('academic_year')) {
            $query->whereHas('examination', function($q) use ($request) {
                $q->where('academic_year', $request->academic_year);
            });
        } else {
            $query->whereHas('examination', function($q) {
                $q->where('academic_year', BrandingHelper::academicYear());
            });
        }

        // Filter by semester
        if ($request->filled('semester')) {
            $query->whereHas('examination', function($q) use ($request) {
                $q->where('semester', $request->semester);
            });
        }

        $results = $query->get();

        // Calculate GPA
        $totalMarks = $results->sum('marks_obtained');
        $totalMaxMarks = $results->sum('max_marks');
        $averagePercentage = $totalMaxMarks > 0 
            ? ($totalMarks / $totalMaxMarks) * 100 
            : 0;

        $gpa = BrandingHelper::calculateGPA($averagePercentage);
        $grade = BrandingHelper::getGrade($averagePercentage);

        $stats = [
            'total_subjects' => $results->count(),
            'total_marks' => $totalMarks,
            'total_max_marks' => $totalMaxMarks,
            'average_percentage' => round($averagePercentage, 2),
            'gpa' => $gpa,
            'grade' => $grade,
        ];

        return view('student.exam-results', compact('results', 'stats'));
    }

    /**
     * View fee statement
     */
    public function feeStatement()
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        // Get fee balance
        $feeBalance = FeeBalance::where('student_id', $student->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->first();

        // Get payment history
        $payments = FeePayment::where('student_id', $student->id)
            ->orderBy('payment_date', 'desc')
            ->get();

        $totalPaid = $payments->sum('amount_paid');
        $pendingAmount = $feeBalance ? $feeBalance->balance_amount : 0;

        $stats = [
            'total_fee' => $feeBalance ? $feeBalance->total_fee : 0,
            'total_paid' => $totalPaid,
            'pending_amount' => $pendingAmount,
            'last_payment_date' => $payments->first() ? $payments->first()->payment_date : null,
        ];

        return view('student.fee-statement', compact('feeBalance', 'payments', 'stats'));
    }

    /**
     * Download fee receipt
     */
    public function downloadReceipt($paymentId)
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        $payment = FeePayment::where('id', $paymentId)
            ->where('student_id', $student->id)
            ->firstOrFail();

        // Generate PDF receipt (simplified - would use PDF library in production)
        return view('student.receipt-download', compact('payment', 'student'));
    }

    /**
     * View timetable
     */
    public function timetable()
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        $student->load('class');

        $timetables = Timetable::where('class_id', $student->class_id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->where('status', 'active')
            ->with(['subject', 'teacher.user', 'room'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        return view('student.timetable', compact('student', 'timetables', 'days'));
    }

    /**
     * View library books
     */
    public function library()
    {
        $student = $this->getAuthenticatedStudent();

        if (!$student) {
            return redirect()->route('login')->with('error', 'Student record not found.');
        }

        // Current borrowed books
        $currentBooks = BookIssue::where('student_id', $student->id)
            ->where('status', 'issued')
            ->with('book')
            ->get();

        // Book history
        $bookHistory = BookIssue::where('student_id', $student->id)
            ->whereIn('status', ['returned', 'lost'])
            ->with('book')
            ->orderBy('issue_date', 'desc')
            ->limit(10)
            ->get();

        // Calculate overdue books and fines
        $overdueBooks = $currentBooks->filter(function($issue) {
            return $issue->return_date && Carbon::parse($issue->return_date)->isPast();
        });

        $totalFines = $overdueBooks->sum(function($issue) {
            $overdueDays = Carbon::parse($issue->return_date)->diffInDays(Carbon::now());
            return $overdueDays * 1000; // 1000 UGX per day
        });

        $stats = [
            'books_borrowed' => $currentBooks->count(),
            'overdue_books' => $overdueBooks->count(),
            'total_fines' => $totalFines,
            'books_returned' => $bookHistory->where('status', 'returned')->count(),
        ];

        return view('student.library', compact('currentBooks', 'bookHistory', 'stats'));
    }

    /**
     * View announcements
     */
    public function announcements()
    {
        $announcements = Announcement::where('status', 'published')
            ->where(function($query) {
                $query->where('target_audience', 'all')
                      ->orWhere('target_audience', 'students');
            })
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return view('student.announcements', compact('announcements'));
    }

    /**
     * View single announcement
     */
    public function viewAnnouncement(Announcement $announcement)
    {
        if ($announcement->status !== 'published') {
            abort(404);
        }

        if (!in_array($announcement->target_audience, ['all', 'students'])) {
            abort(403);
        }

        return view('student.announcement-detail', compact('announcement'));
    }

    /**
     * Helper: Get authenticated student
     */
    private function getAuthenticatedStudent()
    {
        $user = Auth::user();
        return Student::where('user_id', $user->id)->with(['class', 'user'])->first();
    }

    /**
     * Helper: Calculate attendance percentage
     */
    private function getAttendancePercentage($student)
    {
        $totalDays = StudentAttendance::where('student_id', $student->id)
            ->whereYear('date', Carbon::now()->year)
            ->count();

        if ($totalDays === 0) {
            return 0;
        }

        $presentDays = StudentAttendance::where('student_id', $student->id)
            ->whereYear('date', Carbon::now()->year)
            ->whereIn('status', ['present', 'late'])
            ->count();

        return round(($presentDays / $totalDays) * 100, 2);
    }

    /**
     * Helper: Get pending fees
     */
    private function getPendingFees($student)
    {
        $feeBalance = FeeBalance::where('student_id', $student->id)
            ->where('academic_year', BrandingHelper::academicYear())
            ->first();

        return $feeBalance ? $feeBalance->balance_amount : 0;
    }

    /**
     * Helper: Get current GPA
     */
    private function getCurrentGPA($student)
    {
        $results = ExamResult::where('student_id', $student->id)
            ->whereHas('examination', function($q) {
                $q->where('academic_year', BrandingHelper::academicYear());
            })
            ->get();

        if ($results->isEmpty()) {
            return 0.0;
        }

        $totalMarks = $results->sum('marks_obtained');
        $totalMaxMarks = $results->sum('max_marks');
        $averagePercentage = $totalMaxMarks > 0 
            ? ($totalMarks / $totalMaxMarks) * 100 
            : 0;

        return BrandingHelper::calculateGPA($averagePercentage);
    }

    /**
     * Helper: Get books issued count
     */
    private function getBooksIssued($student)
    {
        return BookIssue::where('student_id', $student->id)
            ->where('status', 'issued')
            ->count();
    }
}
