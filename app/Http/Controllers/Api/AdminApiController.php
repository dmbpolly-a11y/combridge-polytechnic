<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\SchoolClass;
use App\Models\Programme;
use App\Models\StudentAttendance;
use App\Models\TeacherAttendance;
use App\Models\FeePayment;
use App\Models\FeeBalance;
use App\Models\Announcement;
use App\Models\Examination;
use App\Helpers\BrandingHelper;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminApiController extends Controller
{
    /**
     * Overall school statistics.
     */
    public function stats()
    {
        return response()->json([
            'total_students'   => Student::where('student_status', 'active')->count(),
            'total_teachers'   => Teacher::where('teacher_status', 'active')->count(),
            'total_classes'    => SchoolClass::where('status', 'active')->count(),
            'total_programmes' => Programme::where('status', 'active')->count(),
        ]);
    }

    /**
     * Today's attendance summary.
     */
    public function attendanceToday()
    {
        $today = Carbon::now()->format('Y-m-d');

        return response()->json([
            'student_present_today' => StudentAttendance::where('date', $today)
                ->whereIn('status', ['present', 'late'])
                ->count(),
            'teacher_present_today' => TeacherAttendance::where('date', $today)
                ->whereIn('status', ['present', 'late'])
                ->count(),
        ]);
    }

    /**
     * Financial summary for the current academic year.
     */
    public function financialSummary()
    {
        $year  = Carbon::now()->year;
        $today = Carbon::now()->format('Y-m-d');

        $collected = FeePayment::whereYear('payment_date', $year)->sum('amount_paid');
        $pending   = FeeBalance::where('academic_year', BrandingHelper::academicYear())->sum('balance_amount');

        return response()->json([
            'total_fees_collected' => BrandingHelper::formatCurrency($collected),
            'pending_fees'         => BrandingHelper::formatCurrency($pending),
            'payments_today'       => FeePayment::whereDate('payment_date', $today)->count(),
        ]);
    }

    /**
     * Five most recently registered students.
     */
    public function recentStudents()
    {
        $students = Student::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($s) => [
                'name'             => $s->user->name ?? 'Unknown',
                'admission_number' => $s->admission_number,
                'created_at'       => $s->created_at->diffForHumans(),
            ]);

        return response()->json(['students' => $students]);
    }

    /**
     * Latest published announcements.
     */
    public function announcements()
    {
        $announcements = Announcement::where('status', 'published')
            ->latest('published_at')
            ->limit(5)
            ->get()
            ->map(fn($a) => [
                'title'        => $a->title,
                'content'      => $a->content,
                'priority'     => $a->priority,
                'published_at' => $a->published_at?->diffForHumans(),
            ]);

        return response()->json(['announcements' => $announcements]);
    }

    /**
     * Upcoming scheduled examinations.
     */
    public function upcomingExams()
    {
        $exams = Examination::where('exam_date', '>=', Carbon::now())
            ->where('status', 'scheduled')
            ->with(['class', 'subject'])
            ->orderBy('exam_date')
            ->limit(5)
            ->get()
            ->map(fn($e) => [
                'subject'    => $e->subject->name ?? 'N/A',
                'class_name' => $e->class->name   ?? 'N/A',
                'exam_type'  => $e->exam_type,
                'exam_date'  => $e->exam_date->format('M d, Y'),
                'start_time' => $e->start_time,
                'end_time'   => $e->end_time,
            ]);

        return response()->json(['exams' => $exams]);
    }
}
