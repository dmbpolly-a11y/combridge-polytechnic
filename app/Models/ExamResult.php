<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'examination_id',
        'student_id',
        'marks_obtained',
        'grade',
        'remarks',
        'is_absent',
        'entered_by',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'is_absent' => 'boolean',
    ];

    /**
     * Get the examination for this result.
     */
    public function examination()
    {
        return $this->belongsTo(Examination::class);
    }

    /**
     * Get the student for this result.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the user who entered the result.
     */
    public function enteredBy()
    {
        return $this->belongsTo(User::class, 'entered_by');
    }

    /**
     * Calculate grade based on marks.
     */
    public static function calculateGrade(float $marks, int $totalMarks): string
    {
        $percentage = ($marks / $totalMarks) * 100;

        if ($percentage >= 80) return 'A';
        if ($percentage >= 70) return 'B';
        if ($percentage >= 60) return 'C';
        if ($percentage >= 50) return 'D';
        return 'F';
    }

    /**
     * Check if the student passed.
     */
    public function hasPassed(): bool
    {
        if ($this->is_absent) return false;
        
        return $this->marks_obtained >= $this->examination->passing_marks;
    }

    /**
     * Get percentage.
     */
    public function getPercentageAttribute()
    {
        if ($this->is_absent) return 0;
        
        return round(($this->marks_obtained / $this->examination->total_marks) * 100, 2);
    }

    /**
     * Scopes
     */
    public function scopePassed($query)
    {
        return $query->where('is_absent', false)
            ->whereHas('examination', function ($q) {
                $q->whereRaw('marks_obtained >= passing_marks');
            });
    }

    public function scopeFailed($query)
    {
        return $query->where('is_absent', false)
            ->whereHas('examination', function ($q) {
                $q->whereRaw('marks_obtained < passing_marks');
            });
    }
}
