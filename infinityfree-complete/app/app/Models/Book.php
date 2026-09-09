<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'isbn',
        'author',
        'publisher',
        'publication_year',
        'category',
        'subject_id',
        'total_copies',
        'available_copies',
        'price',
        'description',
        'shelf_location',
        'status',
    ];

    protected $casts = [
        'publication_year' => 'integer',
        'total_copies' => 'integer',
        'available_copies' => 'integer',
        'price' => 'decimal:2',
    ];

    /**
     * Get the subject associated with this book.
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the issue records for this book.
     */
    public function bookIssues()
    {
        return $this->hasMany(BookIssue::class);
    }

    /**
     * Get currently issued records.
     */
    public function currentlyIssued()
    {
        return $this->bookIssues()->where('status', 'issued');
    }

    /**
     * Check if book is available for issue.
     */
    public function isAvailable(): bool
    {
        return $this->available_copies > 0 && $this->status === 'available';
    }

    /**
     * Issue the book (decrease available copies).
     */
    public function issue(): void
    {
        if ($this->available_copies > 0) {
            $this->available_copies--;
            $this->save();
        }
    }

    /**
     * Return the book (increase available copies).
     */
    public function returnBook(): void
    {
        if ($this->available_copies < $this->total_copies) {
            $this->available_copies++;
            $this->save();
        }
    }

    /**
     * Scopes
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available')
            ->where('available_copies', '>', 0);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeBySubject($query, int $subjectId)
    {
        return $query->where('subject_id', $subjectId);
    }
}
