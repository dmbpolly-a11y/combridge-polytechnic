<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Examination extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'class_id',
        'subject_id',
        'exam_type',
        'exam_date',
        'start_time',
        'end_time',
        'total_marks',
        'passing_marks',
        'room',
        'instructions',
        'status',
    ];

    protected $casts = [
        'exam_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'total_marks' => 'integer',
        'passing_marks' => 'integer',
    ];

    /**
     * Get the class for this examination.
     */
    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the subject for this examination.
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the exam results for this examination.
     */
    public function examResults()
    {
        return $this->hasMany(ExamResult::class, 'examination_id');
    }

    /**
     * Calculate pass percentage.
     */
    public function getPassPercentageAttribute()
    {
        $total = $this->examResults()->count();
        if ($total === 0) return 0;

        $passed = $this->examResults()
            ->where('marks_obtained', '>=', $this->passing_marks)
            ->where('is_absent', false)
            ->count();

        return round(($passed / $total) * 100, 2);
    }

    /**
     * Get average marks.
     */
    public function getAverageMarksAttribute()
    {
        return $this->examResults()
            ->where('is_absent', false)
            ->avg('marks_obtained') ?? 0;
    }

    /**
     * Scopes
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('exam_date', [$startDate, $endDate]);
    }
}
