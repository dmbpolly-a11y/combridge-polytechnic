<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookIssue;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LibraryController extends Controller
{
    /**
     * Display a listing of books
     */
    public function index(Request $request)
    {
        $query = Book::with(['subject']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('author', 'like', "%{$search}%")
                  ->orWhere('isbn', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by subject
        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        $books = $query->latest()->paginate(20);
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        
        // Get unique categories for filter
        $categories = Book::select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        // Statistics
        $stats = [
            'total_books' => Book::count(),
            'total_copies' => Book::sum('total_copies'),
            'available_copies' => Book::sum('available_copies'),
            'issued_books' => BookIssue::where('status', 'issued')->count(),
            'overdue_books' => BookIssue::where('status', 'overdue')->count(),
        ];

        return view('admin.library.index', compact('books', 'subjects', 'categories', 'stats'));
    }

    /**
     * Show the form for creating a new book
     */
    public function create()
    {
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        return view('admin.library.create', compact('subjects'));
    }

    /**
     * Store a newly created book in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'nullable|string|unique:books,isbn',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'category' => 'required|string|max:255',
            'subject_id' => 'nullable|exists:subjects,id',
            'total_copies' => 'required|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:available,unavailable',
        ]);

        // Set available copies equal to total copies initially
        $validated['available_copies'] = $validated['total_copies'];

        Book::create($validated);

        return redirect()->route('admin.library.index')
            ->with('success', 'Book added to library successfully.');
    }

    /**
     * Display the specified book
     */
    public function show(Book $book)
    {
        $book->load(['subject', 'bookIssues.student.user']);
        
        // Get current issues
        $currentIssues = $book->bookIssues()
            ->with('student.user')
            ->where('status', 'issued')
            ->latest()
            ->get();

        // Get issue history
        $issueHistory = $book->bookIssues()
            ->with('student.user', 'issuedBy', 'returnedTo')
            ->where('status', '!=', 'issued')
            ->latest()
            ->paginate(10);

        return view('admin.library.show', compact('book', 'currentIssues', 'issueHistory'));
    }

    /**
     * Show the form for editing the specified book
     */
    public function edit(Book $book)
    {
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        return view('admin.library.edit', compact('book', 'subjects'));
    }

    /**
     * Update the specified book in storage
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'nullable|string|unique:books,isbn,' . $book->id,
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'category' => 'required|string|max:255',
            'subject_id' => 'nullable|exists:subjects,id',
            'total_copies' => 'required|integer|min:1',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'shelf_location' => 'nullable|string|max:255',
            'status' => 'required|in:available,unavailable',
        ]);

        // Adjust available copies if total copies changed
        if ($validated['total_copies'] != $book->total_copies) {
            $difference = $validated['total_copies'] - $book->total_copies;
            $validated['available_copies'] = max(0, $book->available_copies + $difference);
        }

        $book->update($validated);

        return redirect()->route('admin.library.show', $book)
            ->with('success', 'Book updated successfully.');
    }

    /**
     * Remove the specified book from storage
     */
    public function destroy(Book $book)
    {
        // Check if book has active issues
        $activeIssues = $book->bookIssues()->where('status', 'issued')->count();
        
        if ($activeIssues > 0) {
            return redirect()->route('admin.library.index')
                ->with('error', 'Cannot delete book with active issues. Please return all copies first.');
        }

        $book->delete();

        return redirect()->route('admin.library.index')
            ->with('success', 'Book deleted successfully.');
    }

    /**
     * Show issue book form
     */
    public function issueForm()
    {
        $books = Book::where('status', 'available')
            ->where('available_copies', '>', 0)
            ->orderBy('title')
            ->get();
            
        return view('admin.library.issue', compact('books'));
    }

    /**
     * Issue a book to a student
     */
    public function issueBook(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'student_id' => 'required|exists:students,id',
            'issue_date' => 'required|date',
            'due_date' => 'required|date|after:issue_date',
            'remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $book = Book::findOrFail($validated['book_id']);

            // Check if book is available
            if ($book->available_copies < 1) {
                return redirect()->back()
                    ->with('error', 'No copies available for this book.')
                    ->withInput();
            }

            // Check if student already has this book issued
            $existingIssue = BookIssue::where('book_id', $validated['book_id'])
                ->where('student_id', $validated['student_id'])
                ->where('status', 'issued')
                ->first();

            if ($existingIssue) {
                return redirect()->back()
                    ->with('error', 'Student already has a copy of this book issued.')
                    ->withInput();
            }

            // Create book issue record
            $validated['issued_by'] = auth()->id();
            $validated['status'] = 'issued';
            BookIssue::create($validated);

            // Decrease available copies
            $book->decrement('available_copies');

            DB::commit();

            return redirect()->route('admin.library.issues')
                ->with('success', 'Book issued successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to issue book: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Show all book issues
     */
    public function issues(Request $request)
    {
        $query = BookIssue::with(['book', 'student.user', 'issuedBy']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by student
        if ($request->filled('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Search by book title or student name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('book', function($bookQuery) use ($search) {
                    $bookQuery->where('title', 'like', "%{$search}%");
                })
                ->orWhereHas('student.user', function($userQuery) use ($search) {
                    $userQuery->where('first_name', 'like', "%{$search}%")
                             ->orWhere('last_name', 'like', "%{$search}%");
                });
            });
        }

        $issues = $query->latest()->paginate(20);

        // Statistics
        $stats = [
            'total_issued' => BookIssue::where('status', 'issued')->count(),
            'overdue' => BookIssue::where('status', 'overdue')->count(),
            'returned_today' => BookIssue::where('status', 'returned')
                ->whereDate('return_date', today())
                ->count(),
            'total_fines' => BookIssue::where('fine_paid', false)
                ->sum('fine_amount'),
        ];

        return view('admin.library.issues', compact('issues', 'stats'));
    }

    /**
     * Show return book form
     */
    public function returnForm(BookIssue $issue)
    {
        if ($issue->status !== 'issued' && $issue->status !== 'overdue') {
            return redirect()->route('admin.library.issues')
                ->with('error', 'This book has already been returned.');
        }

        $issue->load(['book', 'student.user']);
        
        // Calculate fine if overdue
        $fine = 0;
        if (Carbon::parse($issue->due_date)->isPast()) {
            $daysOverdue = Carbon::parse($issue->due_date)->diffInDays(now());
            $fine = $daysOverdue * 1000; // 1000 UGX per day
        }

        return view('admin.library.return', compact('issue', 'fine'));
    }

    /**
     * Return a book
     */
    public function returnBook(Request $request, BookIssue $issue)
    {
        $validated = $request->validate([
            'return_date' => 'required|date',
            'fine_amount' => 'nullable|numeric|min:0',
            'fine_paid' => 'required|boolean',
            'remarks' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            // Update issue record
            $issue->update([
                'return_date' => $validated['return_date'],
                'status' => 'returned',
                'fine_amount' => $validated['fine_amount'] ?? 0,
                'fine_paid' => $validated['fine_paid'],
                'remarks' => $validated['remarks'] ?? $issue->remarks,
                'returned_to' => auth()->id(),
            ]);

            // Increase available copies
            $issue->book->increment('available_copies');

            DB::commit();

            return redirect()->route('admin.library.issues')
                ->with('success', 'Book returned successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to return book: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Show overdue books
     */
    public function overdueBooks()
    {
        // Update overdue status
        BookIssue::where('status', 'issued')
            ->where('due_date', '<', now())
            ->update(['status' => 'overdue']);

        $overdueIssues = BookIssue::with(['book', 'student.user', 'issuedBy'])
            ->where('status', 'overdue')
            ->orderBy('due_date')
            ->paginate(20);

        // Calculate total fines
        $totalFines = 0;
        foreach ($overdueIssues as $issue) {
            $daysOverdue = Carbon::parse($issue->due_date)->diffInDays(now());
            $totalFines += $daysOverdue * 1000; // 1000 UGX per day
        }

        return view('admin.library.overdue', compact('overdueIssues', 'totalFines'));
    }

    /**
     * Get student borrowing history
     */
    public function studentHistory(Student $student)
    {
        $student->load('user');
        
        $issues = BookIssue::with(['book', 'issuedBy', 'returnedTo'])
            ->where('student_id', $student->id)
            ->latest()
            ->paginate(15);

        $stats = [
            'total_borrowed' => BookIssue::where('student_id', $student->id)->count(),
            'currently_issued' => BookIssue::where('student_id', $student->id)
                ->where('status', 'issued')
                ->count(),
            'overdue' => BookIssue::where('student_id', $student->id)
                ->where('status', 'overdue')
                ->count(),
            'total_fines' => BookIssue::where('student_id', $student->id)
                ->sum('fine_amount'),
            'unpaid_fines' => BookIssue::where('student_id', $student->id')
                ->where('fine_paid', false)
                ->sum('fine_amount'),
        ];

        return view('admin.library.student-history', compact('student', 'issues', 'stats'));
    }

    /**
     * Generate library report
     */
    public function report(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        $report = [
            'total_books' => Book::count(),
            'total_copies' => Book::sum('total_copies'),
            'available_copies' => Book::sum('available_copies'),
            'issued_in_period' => BookIssue::whereBetween('issue_date', [$startDate, $endDate])->count(),
            'returned_in_period' => BookIssue::whereBetween('return_date', [$startDate, $endDate])->count(),
            'currently_issued' => BookIssue::where('status', 'issued')->count(),
            'overdue_books' => BookIssue::where('status', 'overdue')->count(),
            'lost_books' => BookIssue::where('status', 'lost')->count(),
            'fines_collected' => BookIssue::where('fine_paid', true)
                ->whereBetween('return_date', [$startDate, $endDate])
                ->sum('fine_amount'),
            'pending_fines' => BookIssue::where('fine_paid', false)
                ->where('fine_amount', '>', 0)
                ->sum('fine_amount'),
        ];

        // Most borrowed books
        $popularBooks = BookIssue::select('book_id', DB::raw('count(*) as issue_count'))
            ->whereBetween('issue_date', [$startDate, $endDate])
            ->groupBy('book_id')
            ->orderBy('issue_count', 'desc')
            ->limit(10)
            ->with('book')
            ->get();

        // Most active borrowers
        $topBorrowers = BookIssue::select('student_id', DB::raw('count(*) as borrow_count'))
            ->whereBetween('issue_date', [$startDate, $endDate])
            ->groupBy('student_id')
            ->orderBy('borrow_count', 'desc')
            ->limit(10)
            ->with('student.user')
            ->get();

        return view('admin.library.report', compact('report', 'popularBooks', 'topBorrowers', 'startDate', 'endDate'));
    }

    /**
     * Search for student by admission number or name
     */
    public function searchStudent(Request $request)
    {
        $search = $request->input('q');
        
        $students = Student::with('user')
            ->where('admission_number', 'like', "%{$search}%")
            ->orWhereHas('user', function($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get()
            ->map(function($student) {
                return [
                    'id' => $student->id,
                    'text' => $student->user->first_name . ' ' . $student->user->last_name . ' (' . $student->admission_number . ')',
                    'admission_number' => $student->admission_number,
                ];
            });

        return response()->json($students);
    }
}
