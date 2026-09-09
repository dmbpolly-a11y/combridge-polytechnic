<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'subject_id',
        'teacher_id',
        'room_id',
        'day_of_week',
        'start_time',
        'end_time',
        'academic_year',
        'semester',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'semester' => 'integer',
    ];

    /**
     * Get the class for this timetable entry.
     */
    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the subject for this timetable entry.
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the teacher for this timetable entry.
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get the room for this timetable entry.
     */
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get duration in hours.
     */
    public function getDurationAttribute()
    {
        $start = \Carbon\Carbon::parse($this->start_time);
        $end = \Carbon\Carbon::parse($this->end_time);
        
        return $end->diffInHours($start);
    }

    /**
     * Check if teacher is available at this time.
     */
    public static function isTeacherAvailable(int $teacherId, string $dayOfWeek, string $startTime, string $endTime, ?int $timetableId = null): bool
    {
        $query = self::where('teacher_id', $teacherId)
            ->where('day_of_week', $dayOfWeek)
            ->where('status', 'active')
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($q2) use ($startTime, $endTime) {
                      $q2->where('start_time', '<=', $startTime)
                         ->where('end_time', '>=', $endTime);
                  });
            });

        if ($timetableId) {
            $query->where('id', '!=', $timetableId);
        }

        return !$query->exists();
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByDay($query, string $day)
    {
        return $query->where('day_of_week', $day);
    }

    public function scopeByAcademicYear($query, string $academicYear)
    {
        return $query->where('academic_year', $academicYear);
    }

    public function scopeBySemester($query, int $semester)
    {
        return $query->where('semester', $semester);
    }
}
