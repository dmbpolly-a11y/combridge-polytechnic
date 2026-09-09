<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FeePayment;
use App\Models\FeeBalance;
use App\Models\FeeStructure;
use App\Models\Student;
use App\Models\Programme;
use App\Helpers\BrandingHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;
use PDF;

class FeeController extends Controller
{
    /**
     * Display payments list
     */
    public function index(Request $request)
    {
        $query = FeePayment::with(['student.user', 'feeStructure', 'collectedBy']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('receipt_number', 'like', "%{$search}%")
                  ->orWhereHas('student.user', function ($userQuery) use ($search) {
                      $userQuery->where('first_name', 'like', "%{$search}%")
                               ->orWhere('last_name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('student', function ($studentQuery) use ($search) {
                      $studentQuery->where('admission_number', 'like', "%{$search}%");
                  });
            });
        }

        // Date range filter
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('payment_date', [$request->start_date, $request->end_date]);
        }

        // Payment method filter
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $payments = $query->latest('payment_date')->paginate(20);

        // Statistics
        $today = today();
        $thisMonth = now()->startOfMonth();
        
        $stats = [
            'total_collection' => FeePayment::where('status', 'completed')->sum('amount_paid'),
            'today_collection' => FeePayment::where('status', 'completed')
                ->whereDate('payment_date', $today)
                ->sum('amount_paid'),
            'month_collection' => FeePayment::where('status', 'completed')
                ->whereDate('payment_date', '>=', $thisMonth)
                ->sum('amount_paid'),
            'total_payments' => FeePayment::where('status', 'completed')->count(),
        ];

        return view('admin.fees.index', compact('payments', 'stats'));
    }

    /**
     * Fee Structures Management
     */
    public function structures()
    {
        $structures = FeeStructure::with('programme')->latest()->paginate(20);
        $programmes = Programme::where('status', 'active')->orderBy('name')->get();

        return view('admin.fees.structures', compact('structures', 'programmes'));
    }

    /**
     * Create fee structure
     */
    public function storeStructure(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'programme_id' => 'nullable|exists:programmes,id',
            'year' => 'nullable|integer|min:1|max:5',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:one_time,per_semester,per_year',
            'fee_type' => 'required|in:tuition,library,lab,sports,exam,other',
            'is_mandatory' => 'required|boolean',
        ]);

        $validated['status'] = 'active';

        FeeStructure::create($validated);

        return redirect()->route('admin.fees.structures')
            ->with('success', 'Fee structure created successfully.');
    }

    /**
     * Update fee structure
     */
    public function updateStructure(Request $request, FeeStructure $structure)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'programme_id' => 'nullable|exists:programmes,id',
            'year' => 'nullable|integer|min:1|max:5',
            'amount' => 'required|numeric|min:0',
            'frequency' => 'required|in:one_time,per_semester,per_year',
            'fee_type' => 'required|in:tuition,library,lab,sports,exam,other',
            'is_mandatory' => 'required|boolean',
            'status' => 'required|in:active,inactive',
        ]);

        $structure->update($validated);

        return redirect()->route('admin.fees.structures')
            ->with('success', 'Fee structure updated successfully.');
    }

    /**
     * Delete fee structure
     */
    public function destroyStructure(FeeStructure $structure)
    {
        // Check if there are payments
        if ($structure->payments()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Cannot delete fee structure with existing payments.');
        }

        $structure->delete();

        return redirect()->route('admin.fees.structures')
            ->with('success', 'Fee structure deleted successfully.');
    }

    /**
     * Show fee collection form
     */
    public function collect(Request $request)
    {
        $students = collect();
        $feeStructures = FeeStructure::where('status', 'active')->orderBy('name')->get();
        $selectedStudent = null;

        if ($request->filled('student_id')) {
            $selectedStudent = Student::with(['user', 'programme', 'feeBalances'])
                ->findOrFail($request->student_id);
        }

        return view('admin.fees.collect', compact('students', 'feeStructures', 'selectedStudent'));
    }

    /**
     * Store fee payment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'fee_structure_id' => 'required|exists:fee_structures,id',
            'amount_paid' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:cash,bank_transfer,mobile_money,cheque,card',
            'transaction_reference' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Generate receipt number
            $receiptNumber = $this->generateReceiptNumber();

            $payment = FeePayment::create([
                'student_id' => $validated['student_id'],
                'fee_structure_id' => $validated['fee_structure_id'],
                'receipt_number' => $receiptNumber,
                'amount_paid' => $validated['amount_paid'],
                'payment_date' => $validated['payment_date'],
                'payment_method' => $validated['payment_method'],
                'transaction_reference' => $validated['transaction_reference'] ?? null,
                'remarks' => $validated['remarks'] ?? null,
                'collected_by' => auth()->id(),
                'status' => 'completed',
            ]);

            // Update fee balance
            $academicYear = BrandingHelper::academicYear();
            $feeStructure = FeeStructure::find($validated['fee_structure_id']);
            
            $balance = FeeBalance::firstOrCreate(
                [
                    'student_id' => $validated['student_id'],
                    'academic_year' => $academicYear,
                ],
                [
                    'total_fee' => $feeStructure->amount,
                    'paid_amount' => 0,
                    'balance' => $feeStructure->amount,
                ]
            );

            // Update balance
            $balance->paid_amount += $validated['amount_paid'];
            $balance->balance = $balance->total_fee - $balance->paid_amount;
            $balance->save();

            DB::commit();

            return redirect()->route('admin.fees.receipt', $payment)
                ->with('success', 'Payment recorded successfully. Receipt Number: ' . $receiptNumber);

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error processing payment: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Generate unique receipt number
     */
    private function generateReceiptNumber()
    {
        $prefix = 'RCP';
        $year = date('Y');
        $lastPayment = FeePayment::whereYear('created_at', $year)
            ->orderBy('id', 'desc')
            ->first();

        $number = $lastPayment ? (int) substr($lastPayment->receipt_number, -6) + 1 : 1;

        return $prefix . '-' . $year . '-' . str_pad($number, 6, '0', STR_PAD_LEFT);
    }

    /**
     * Display receipt
     */
    public function receipt(FeePayment $payment)
    {
        $payment->load(['student.user', 'student.programme', 'student.class', 'feeStructure', 'collectedBy']);
        
        return view('admin.fees.receipt', compact('payment'));
    }

    /**
     * Download receipt as PDF
     */
    public function downloadReceipt(FeePayment $payment)
    {
        $payment->load(['student.user', 'student.programme', 'feeStructure', 'collectedBy']);

        $pdf = PDF::loadView('admin.fees.receipt-pdf', compact('payment'));
        
        $fileName = 'receipt_' . $payment->receipt_number . '.pdf';

        return $pdf->download($fileName);
    }

    /**
     * Print receipt
     */
    public function printReceipt(FeePayment $payment)
    {
        $payment->load(['student.user', 'student.programme', 'feeStructure', 'collectedBy']);
        
        return view('admin.fees.receipt-print', compact('payment'));
    }

    /**
     * Fee balances dashboard
     */
    public function balances(Request $request)
    {
        $query = FeeBalance::with(['student.user', 'student.programme']);

        // Academic year filter
        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        } else {
            $query->where('academic_year', BrandingHelper::academicYear());
        }

        // Balance status filter
        if ($request->filled('filter')) {
            if ($request->filter === 'with_balance') {
                $query->where('balance', '>', 0);
            } elseif ($request->filter === 'fully_paid') {
                $query->where('balance', '<=', 0);
            } elseif ($request->filter === 'overdue') {
                $query->where('balance', '>', 0);
            }
        }

        // Programme filter
        if ($request->filled('programme_id')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('programme_id', $request->programme_id);
            });
        }

        $balances = $query->latest()->paginate(20);
        $programmes = Programme::where('status', 'active')->orderBy('name')->get();

        // Statistics
        $currentYear = $request->input('academic_year', BrandingHelper::academicYear());
        $stats = [
            'total_expected' => FeeBalance::where('academic_year', $currentYear)->sum('total_fee'),
            'total_collected' => FeeBalance::where('academic_year', $currentYear)->sum('paid_amount'),
            'total_balance' => FeeBalance::where('academic_year', $currentYear)->sum('balance'),
            'students_with_balance' => FeeBalance::where('academic_year', $currentYear)
                ->where('balance', '>', 0)
                ->count(),
            'fully_paid' => FeeBalance::where('academic_year', $currentYear)
                ->where('balance', '<=', 0)
                ->count(),
        ];

        return view('admin.fees.balances', compact('balances', 'programmes', 'stats'));
    }

    /**
     * Student fee statement
     */
    public function statement(Student $student)
    {
        $student->load(['user', 'programme', 'class']);
        
        $payments = FeePayment::where('student_id', $student->id)
            ->with(['feeStructure', 'collectedBy'])
            ->latest('payment_date')
            ->get();

        $balances = FeeBalance::where('student_id', $student->id)
            ->latest('academic_year')
            ->get();

        $summary = [
            'total_paid' => $payments->sum('amount_paid'),
            'current_balance' => $balances->first()->balance ?? 0,
            'payment_count' => $payments->count(),
        ];

        return view('admin.fees.statement', compact('student', 'payments', 'balances', 'summary'));
    }

    /**
     * Download statement as PDF
     */
    public function downloadStatement(Student $student)
    {
        $student->load(['user', 'programme', 'class']);
        
        $payments = FeePayment::where('student_id', $student->id)
            ->with(['feeStructure', 'collectedBy'])
            ->latest('payment_date')
            ->get();

        $balances = FeeBalance::where('student_id', $student->id)
            ->latest('academic_year')
            ->get();

        $pdf = PDF::loadView('admin.fees.statement-pdf', 
            compact('student', 'payments', 'balances'));
        
        $fileName = 'fee_statement_' . $student->admission_number . '.pdf';

        return $pdf->download($fileName);
    }

    /**
     * Financial reports
     */
    public function reports(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        // Collection by payment method
        $collectionByMethod = FeePayment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->select('payment_method', DB::raw('SUM(amount_paid) as total'))
            ->groupBy('payment_method')
            ->get();

        // Collection by fee type
        $collectionByType = FeePayment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->join('fee_structures', 'fee_payments.fee_structure_id', '=', 'fee_structures.id')
            ->select('fee_structures.fee_type', DB::raw('SUM(fee_payments.amount_paid) as total'))
            ->groupBy('fee_structures.fee_type')
            ->get();

        // Daily collections
        $dailyCollections = FeePayment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->select(DB::raw('DATE(payment_date) as date'), DB::raw('SUM(amount_paid) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Top collectors
        $topCollectors = FeePayment::where('status', 'completed')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->select('collected_by', DB::raw('SUM(amount_paid) as total'), DB::raw('COUNT(*) as count'))
            ->groupBy('collected_by')
            ->with('collectedBy')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get();

        $summary = [
            'total_collection' => FeePayment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->sum('amount_paid'),
            'total_transactions' => FeePayment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->count(),
            'average_payment' => FeePayment::where('status', 'completed')
                ->whereBetween('payment_date', [$startDate, $endDate])
                ->avg('amount_paid'),
        ];

        return view('admin.fees.reports', compact(
            'collectionByMethod',
            'collectionByType',
            'dailyCollections',
            'topCollectors',
            'summary',
            'startDate',
            'endDate'
        ));
    }

    /**
     * Defaulters list (students with outstanding balances)
     */
    public function defaulters(Request $request)
    {
        $query = FeeBalance::with(['student.user', 'student.programme', 'student.class'])
            ->where('balance', '>', 0);

        if ($request->filled('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        } else {
            $query->where('academic_year', BrandingHelper::academicYear());
        }

        if ($request->filled('programme_id')) {
            $query->whereHas('student', function($q) use ($request) {
                $q->where('programme_id', $request->programme_id);
            });
        }

        // Sort by balance amount
        $query->orderBy('balance', 'desc');

        $defaulters = $query->paginate(50);
        $programmes = Programme::where('status', 'active')->orderBy('name')->get();

        $stats = [
            'total_defaulters' => $query->count(),
            'total_outstanding' => $query->sum('balance'),
        ];

        return view('admin.fees.defaulters', compact('defaulters', 'programmes', 'stats'));
    }

    /**
     * Search student (AJAX)
     */
    public function searchStudent(Request $request)
    {
        $search = $request->input('q');
        
        $students = Student::with(['user', 'programme'])
            ->where('student_status', 'active')
            ->where(function($query) use ($search) {
                $query->where('admission_number', 'like', "%{$search}%")
                      ->orWhereHas('user', function($q) use ($search) {
                          $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                      });
            })
            ->limit(10)
            ->get()
            ->map(function($student) {
                return [
                    'id' => $student->id,
                    'text' => $student->user->first_name . ' ' . $student->user->last_name . 
                             ' (' . $student->admission_number . ')',
                    'admission_number' => $student->admission_number,
                    'programme' => $student->programme->name ?? 'N/A',
                ];
            });

        return response()->json($students);
    }
}
