<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class BookIssue extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'student_id',
        'issue_date',
        'due_date',
        'return_date',
        'status',
        'fine_amount',
        'fine_paid',
        'remarks',
        'issued_by',
        'returned_to',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'return_date' => 'date',
        'fine_amount' => 'decimal:2',
        'fine_paid' => 'boolean',
    ];

    /**
     * Boot function to handle status changes.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($issue) {
            // Decrease available copies when book is issued
            $issue->book->issue();
        });

        static::updated(function ($issue) {
            // Increase available copies when book is returned
            if ($issue->isDirty('status') && $issue->status === 'returned') {
                $issue->book->returnBook();
            }
        });
    }

    /**
     * Get the book that was issued.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the student who borrowed the book.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the user who issued the book.
     */
    public function issuedBy()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    /**
     * Get the user who received the returned book.
     */
    public function returnedTo()
    {
        return $this->belongsTo(User::class, 'returned_to');
    }

    /**
     * Check if book is overdue.
     */
    public function isOverdue(): bool
    {
        if ($this->status === 'returned') {
            return false;
        }

        return Carbon::today()->greaterThan($this->due_date);
    }

    /**
     * Calculate fine for overdue books.
     */
    public function calculateFine(float $finePerDay = 100): float
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        $overdueDays = Carbon::today()->diffInDays($this->due_date);
        return $overdueDays * $finePerDay;
    }

    /**
     * Get days overdue.
     */
    public function getDaysOverdueAttribute(): int
    {
        if (!$this->isOverdue()) {
            return 0;
        }

        return Carbon::today()->diffInDays($this->due_date);
    }

    /**
     * Scopes
     */
    public function scopeIssued($query)
    {
        return $query->where('status', 'issued');
    }

    public function scopeReturned($query)
    {
        return $query->where('status', 'returned');
    }

    public function scopeOverdue($query)
    {
        return $query->where('status', 'issued')
            ->where('due_date', '<', Carbon::today());
    }

    public function scopeWithUnpaidFine($query)
    {
        return $query->where('fine_amount', '>', 0)
            ->where('fine_paid', false);
    }
}
