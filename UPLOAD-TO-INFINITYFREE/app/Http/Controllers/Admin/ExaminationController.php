<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Examination;
use App\Models\ExamResult;
use App\Models\GradingSystem;
use App\Models\ReportCard;
use App\Models\ReportCardSubject;
use App\Models\Transcript;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Student;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\BrandingHelper;
use Carbon\Carbon;
use PDF;

class ExaminationController extends Controller
{
    /**
     * Display examinations list
     */
    public function index(Request $request)
    {
        $query = Examination::with(['class', 'subject']);

        // Filters
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->class_id);
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        if ($request->filled('exam_type')) {
            $query->where('exam_type', $request->exam_type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $examinations = $query->latest('exam_date')->paginate(20);
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();

        // Statistics
        $stats = [
            'total_exams' => Examination::count(),
            'scheduled' => Examination::where('status', 'scheduled')->count(),
            'ongoing' => Examination::where('status', 'ongoing')->count(),
            'completed' => Examination::where('status', 'completed')->count(),
        ];

        return view('admin.examinations.index', compact('examinations', 'classes', 'subjects', 'stats'));
    }

    /**
     * Show create examination form
     */
    public function create()
    {
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        $rooms = Room::where('status', 'available')->orderBy('name')->get();

        return view('admin.examinations.create', compact('classes', 'subjects', 'rooms'));
    }

    /**
     * Store new examination
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'exam_type' => 'required|in:quiz,mid_term,final,practical,assignment',
            'exam_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'total_marks' => 'required|integer|min:1',
            'passing_marks' => 'required|integer|min:0|lte:total_marks',
            'room' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
        ]);

        $validated['status'] = 'scheduled';

        Examination::create($validated);

        return redirect()->route('admin.examinations.index')
            ->with('success', 'Examination scheduled successfully.');
    }

    /**
     * Display examination details
     */
    public function show(Examination $examination)
    {
        $examination->load(['class.students.user', 'subject']);
        
        // Get results
        $results = $examination->results()
            ->with('student.user')
            ->orderBy('marks_obtained', 'desc')
            ->get();

        // Calculate statistics
        $stats = [
            'total_students' => $examination->class->students->count(),
            'submitted_results' => $results->count(),
            'pending_results' => $examination->class->students->count() - $results->count(),
            'passed' => $results->where('marks_obtained', '>=', $examination->passing_marks)->count(),
            'failed' => $results->where('marks_obtained', '<', $examination->passing_marks)->count(),
            'absent' => $results->where('is_absent', true)->count(),
            'highest_marks' => $results->max('marks_obtained') ?? 0,
            'lowest_marks' => $results->min('marks_obtained') ?? 0,
            'average_marks' => $results->avg('marks_obtained') ?? 0,
        ];

        return view('admin.examinations.show', compact('examination', 'results', 'stats'));
    }

    /**
     * Show edit examination form
     */
    public function edit(Examination $examination)
    {
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        $rooms = Room::where('status', 'available')->orderBy('name')->get();

        return view('admin.examinations.edit', compact('examination', 'classes', 'subjects', 'rooms'));
    }

    /**
     * Update examination
     */
    public function update(Request $request, Examination $examination)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'class_id' => 'required|exists:classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'exam_type' => 'required|in:quiz,mid_term,final,practical,assignment',
            'exam_date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'total_marks' => 'required|integer|min:1',
            'passing_marks' => 'required|integer|min:0|lte:total_marks',
            'room' => 'nullable|string|max:255',
            'instructions' => 'nullable|string',
            'status' => 'required|in:scheduled,ongoing,completed,cancelled',
        ]);

        $examination->update($validated);

        return redirect()->route('admin.examinations.show', $examination)
            ->with('success', 'Examination updated successfully.');
    }

    /**
     * Delete examination
     */
    public function destroy(Examination $examination)
    {
        // Check if there are results
        if ($examination->results()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete examination with existing results.');
        }

        $examination->delete();

        return redirect()->route('admin.examinations.index')
            ->with('success', 'Examination deleted successfully.');
    }

    /**
     * Show marks entry form
     */
    public function enterMarks(Examination $examination)
    {
        $examination->load(['class.students.user', 'subject']);
        
        // Get existing results
        $existingResults = $examination->results()
            ->pluck('marks_obtained', 'student_id')
            ->toArray();

        return view('admin.examinations.enter-marks', compact('examination', 'existingResults'));
    }

    /**
     * Store/Update marks
     */
    public function storeMarks(Request $request, Examination $examination)
    {
        $request->validate([
            'marks' => 'required|array',
            'marks.*.student_id' => 'required|exists:students,id',
            'marks.*.marks_obtained' => 'required|numeric|min:0|max:' . $examination->total_marks,
            'marks.*.is_absent' => 'nullable|boolean',
            'marks.*.remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $gradingSystem = GradingSystem::orderBy('min_marks', 'desc')->get();

            foreach ($request->marks as $mark) {
                // Calculate grade
                $marksObtained = $mark['marks_obtained'];
                $grade = $this->calculateGrade($marksObtained, $gradingSystem);

                ExamResult::updateOrCreate(
                    [
                        'examination_id' => $examination->id,
                        'student_id' => $mark['student_id'],
                    ],
                    [
                        'marks_obtained' => $marksObtained,
                        'grade' => $grade,
                        'is_absent' => $mark['is_absent'] ?? false,
                        'remarks' => $mark['remarks'] ?? null,
                        'entered_by' => auth()->id(),
                    ]
                );
            }

            // Update examination status
            if ($examination->status === 'scheduled' || $examination->status === 'ongoing') {
                $examination->update(['status' => 'completed']);
            }

            DB::commit();

            return redirect()->route('admin.examinations.show', $examination)
                ->with('success', 'Marks entered successfully for ' . count($request->marks) . ' students.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to enter marks: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Calculate grade based on marks
     */
    private function calculateGrade($marks, $gradingSystem)
    {
        foreach ($gradingSystem as $grade) {
            if ($marks >= $grade->min_marks && $marks <= $grade->max_marks) {
                return $grade->grade;
            }
        }
        return 'F';
    }

    /**
     * Generate report card
     */
    public function generateReportCard(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'academic_year' => 'required|string',
            'semester' => 'required|integer|in:1,2,3',
        ]);

        $student = Student::with(['user', 'class', 'programme'])->findOrFail($request->student_id);
        
        // Get all exam results for the student in this period
        $examinations = Examination::where('class_id', $student->class_id)
            ->whereYear('exam_date', '=', substr($request->academic_year, 0, 4))
            ->get();

        $results = ExamResult::whereIn('examination_id', $examinations->pluck('id'))
            ->where('student_id', $student->id)
            ->with('examination.subject')
            ->get();

        // Group by subject
        $subjectResults = $results->groupBy('examination.subject_id');
        
        $reportData = [];
        $totalMarks = 0;
        $totalGradePoints = 0;
        $subjectCount = 0;

        foreach ($subjectResults as $subjectId => $subjectExams) {
            $subjectMarks = $subjectExams->avg('marks_obtained');
            $subject = $subjectExams->first()->examination->subject;
            
            $grade = BrandingHelper::getGrade($subjectMarks);
            $gradePoint = BrandingHelper::getGPA($subjectMarks);

            $reportData[] = [
                'subject' => $subject,
                'marks' => round($subjectMarks, 2),
                'grade' => $grade,
                'grade_point' => $gradePoint,
            ];

            $totalMarks += $subjectMarks;
            $totalGradePoints += $gradePoint;
            $subjectCount++;
        }

        $averageMarks = $subjectCount > 0 ? round($totalMarks / $subjectCount, 2) : 0;
        $gpa = $subjectCount > 0 ? round($totalGradePoints / $subjectCount, 2) : 0;

        // Get class ranking
        $classStudents = Student::where('class_id', $student->class_id)->pluck('id');
        // This is simplified - actual ranking would need more complex calculation

        // Create or update report card
        DB::beginTransaction();
        try {
            $reportCard = ReportCard::updateOrCreate(
                [
                    'student_id' => $student->id,
                    'academic_year' => $request->academic_year,
                    'semester' => $request->semester,
                ],
                [
                    'class_id' => $student->class_id,
                    'total_marks' => $totalMarks,
                    'average_marks' => $averageMarks,
                    'gpa' => $gpa,
                    'total_students' => $classStudents->count(),
                    'generated_date' => now(),
                    'generated_by' => auth()->id(),
                    'status' => 'draft',
                ]
            );

            // Store subject-wise results
            ReportCardSubject::where('report_card_id', $reportCard->id)->delete();
            
            foreach ($reportData as $data) {
                ReportCardSubject::create([
                    'report_card_id' => $reportCard->id,
                    'subject_id' => $data['subject']->id,
                    'marks' => $data['marks'],
                    'grade' => $data['grade'],
                    'grade_point' => $data['grade_point'],
                ]);
            }

            DB::commit();

            return redirect()->route('admin.examinations.report-card.show', $reportCard)
                ->with('success', 'Report card generated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to generate report card: ' . $e->getMessage());
        }
    }

    /**
     * Show report card
     */
    public function showReportCard(ReportCard $reportCard)
    {
        $reportCard->load([
            'student.user',
            'student.class',
            'student.programme',
            'subjects.subject',
            'generatedBy'
        ]);

        return view('admin.examinations.report-card', compact('reportCard'));
    }

    /**
     * Finalize report card
     */
    public function finalizeReportCard(Request $request, ReportCard $reportCard)
    {
        $request->validate([
            'remarks' => 'nullable|string',
            'head_teacher_remarks' => 'nullable|string',
        ]);

        $reportCard->update([
            'remarks' => $request->remarks,
            'head_teacher_remarks' => $request->head_teacher_remarks,
            'status' => 'finalized',
        ]);

        return redirect()->back()
            ->with('success', 'Report card finalized successfully.');
    }

    /**
     * Publish report card
     */
    public function publishReportCard(ReportCard $reportCard)
    {
        $reportCard->update(['status' => 'published']);

        // TODO: Send notification to student/parent

        return redirect()->back()
            ->with('success', 'Report card published successfully.');
    }

    /**
     * Download report card as PDF
     */
    public function downloadReportCard(ReportCard $reportCard)
    {
        $reportCard->load([
            'student.user',
            'student.class',
            'student.programme',
            'subjects.subject'
        ]);

        $pdf = PDF::loadView('admin.examinations.report-card-pdf', compact('reportCard'));
        
        $fileName = 'report_card_' . $reportCard->student->admission_number . '_' . 
                    $reportCard->academic_year . '_S' . $reportCard->semester . '.pdf';

        return $pdf->download($fileName);
    }

    /**
     * Generate transcript
     */
    public function generateTranscript(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
        ]);

        $student = Student::with(['user', 'programme', 'reportCards'])->findOrFail($request->student_id);

        // Calculate cumulative GPA from all finalized report cards
        $finalizedReports = $student->reportCards()
            ->where('status', 'finalized')
            ->orWhere('status', 'published')
            ->get();

        if ($finalizedReports->isEmpty()) {
            return redirect()->back()
                ->with('error', 'No finalized report cards found for this student.');
        }

        $cumulativeGPA = $finalizedReports->avg('gpa');
        $totalCredits = $finalizedReports->count() * 15; // Assuming 15 credits per semester

        // Get all subjects and marks
        $coursesCompleted = [];
        foreach ($finalizedReports as $report) {
            $subjects = $report->subjects()->with('subject')->get();
            foreach ($subjects as $subject) {
                $coursesCompleted[] = [
                    'subject' => $subject->subject->name,
                    'code' => $subject->subject->code,
                    'marks' => $subject->marks,
                    'grade' => $subject->grade,
                    'grade_point' => $subject->grade_point,
                    'semester' => $report->semester,
                    'year' => $report->academic_year,
                ];
            }
        }

        // Generate transcript number
        $transcriptNumber = 'TR-' . date('Y') . '-' . str_pad($student->id, 6, '0', STR_PAD_LEFT);

        DB::beginTransaction();
        try {
            $transcript = Transcript::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'transcript_number' => $transcriptNumber,
                    'cumulative_gpa' => round($cumulativeGPA, 2),
                    'courses_completed' => json_encode($coursesCompleted),
                    'total_credits' => $totalCredits,
                    'issue_date' => now(),
                    'issued_by' => auth()->id(),
                    'status' => 'draft',
                ]
            );

            DB::commit();

            return redirect()->route('admin.examinations.transcript.show', $transcript)
                ->with('success', 'Transcript generated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to generate transcript: ' . $e->getMessage());
        }
    }

    /**
     * Show transcript
     */
    public function showTranscript(Transcript $transcript)
    {
        $transcript->load(['student.user', 'student.programme', 'issuedBy']);
        $coursesCompleted = json_decode($transcript->courses_completed, true);

        return view('admin.examinations.transcript', compact('transcript', 'coursesCompleted'));
    }

    /**
     * Issue transcript
     */
    public function issueTranscript(Transcript $transcript)
    {
        $transcript->update(['status' => 'issued']);

        return redirect()->back()
            ->with('success', 'Transcript issued successfully.');
    }

    /**
     * Download transcript as PDF
     */
    public function downloadTranscript(Transcript $transcript)
    {
        $transcript->load(['student.user', 'student.programme']);
        $coursesCompleted = json_decode($transcript->courses_completed, true);

        $pdf = PDF::loadView('admin.examinations.transcript-pdf', 
            compact('transcript', 'coursesCompleted'));
        
        $fileName = 'transcript_' . $transcript->student->admission_number . '.pdf';

        return $pdf->download($fileName);
    }

    /**
     * Results analysis
     */
    public function analysis(Request $request)
    {
        $classes = SchoolClass::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();

        $analysisData = null;

        if ($request->filled('class_id') && $request->filled('subject_id')) {
            $examinations = Examination::where('class_id', $request->class_id)
                ->where('subject_id', $request->subject_id)
                ->where('status', 'completed')
                ->with('results')
                ->get();

            if ($examinations->isNotEmpty()) {
                $allResults = $examinations->flatMap(function($exam) {
                    return $exam->results;
                });

                $analysisData = [
                    'total_exams' => $examinations->count(),
                    'total_results' => $allResults->count(),
                    'average_marks' => round($allResults->avg('marks_obtained'), 2),
                    'highest_marks' => $allResults->max('marks_obtained'),
                    'lowest_marks' => $allResults->min('marks_obtained'),
                    'pass_rate' => $this->calculatePassRate($allResults, $examinations->first()->passing_marks),
                    'grade_distribution' => $this->getGradeDistribution($allResults),
                ];
            }
        }

        return view('admin.examinations.analysis', compact('classes', 'subjects', 'analysisData'));
    }

    /**
     * Calculate pass rate
     */
    private function calculatePassRate($results, $passingMarks)
    {
        $total = $results->where('is_absent', false)->count();
        if ($total == 0) return 0;

        $passed = $results->where('is_absent', false)
            ->where('marks_obtained', '>=', $passingMarks)
            ->count();

        return round(($passed / $total) * 100, 2);
    }

    /**
     * Get grade distribution
     */
    private function getGradeDistribution($results)
    {
        return $results->groupBy('grade')->map(function($group) {
            return $group->count();
        })->toArray();
    }
}
