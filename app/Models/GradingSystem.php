<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradingSystem extends Model
{
    use HasFactory;

    protected $fillable = [
        'grade',
        'min_marks',
        'max_marks',
        'grade_point',
        'description',
    ];

    protected $casts = [
        'min_marks' => 'integer',
        'max_marks' => 'integer',
        'grade_point' => 'decimal:2',
    ];

    /**
     * Get grade for given marks.
     */
    public static function getGradeForMarks(float $marks): ?self
    {
        return self::where('min_marks', '<=', $marks)
            ->where('max_marks', '>=', $marks)
            ->first();
    }

    /**
     * Scopes
     */
    public function scopeOrderByMarks($query)
    {
        return $query->orderBy('min_marks', 'desc');
    }
}
