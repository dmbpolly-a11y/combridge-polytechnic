<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SchoolClass extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'code',
        'programme_id',
        'year',
        'semester',
        'academic_year',
        'class_teacher_id',
        'capacity',
        'status',
    ];

    protected $casts = [
        'year' => 'integer',
        'semester' => 'integer',
        'capacity' => 'integer',
    ];

    /**
     * Get the programme that owns this class.
     */
    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }

    /**
     * Get the class teacher.
     */
    public function classTeacher()
    {
        return $this->belongsTo(User::class, 'class_teacher_id');
    }

    /**
     * Get the students in this class.
     */
    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }

    /**
     * Get the examinations for this class.
     */
    public function examinations()
    {
        return $this->hasMany(Examination::class, 'class_id');
    }

    /**
     * Get the timetables for this class.
     */
    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

    /**
     * Get the attendance records for this class.
     */
    public function attendanceRecords()
    {
        return $this->hasMany(StudentAttendance::class, 'class_id');
    }

    /**
     * Get the announcements for this class.
     */
    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    /**
     * Get the count of enrolled students.
     */
    public function getEnrolledCountAttribute(): int
    {
        return $this->students()->count();
    }

    /**
     * Check if class is full.
     */
    public function isFull(): bool
    {
        return $this->enrolled_count >= $this->capacity;
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByAcademicYear($query, string $academicYear)
    {
        return $query->where('academic_year', $academicYear);
    }
}
