<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'staff_id',
        'department_id',
        'join_date',
        'qualification',
        'specialization',
        'experience',
        'salary',
        'employee_type',
        'teacher_status',
    ];

    protected $casts = [
        'join_date' => 'date',
        'salary' => 'decimal:2',
    ];

    /**
     * Get the user record associated with the teacher.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the department the teacher belongs to.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the subjects taught by this teacher.
     */
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'subject_teacher')
            ->withPivot('class_id', 'academic_year')
            ->withTimestamps();
    }

    /**
     * Get the classes where this teacher is the class teacher.
     */
    public function classesAsClassTeacher()
    {
        return $this->hasMany(SchoolClass::class, 'class_teacher_id');
    }

    /**
     * Get the timetable entries for this teacher.
     */
    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

    /**
     * Get the attendance records for this teacher.
     */
    public function attendanceRecords()
    {
        return $this->hasMany(TeacherAttendance::class);
    }

    /**
     * Get the examinations supervised by this teacher.
     */
    public function examinations()
    {
        return $this->hasMany(Examination::class, 'created_by');
    }

    /**
     * Check if teacher teaches a specific subject.
     */
    public function teachesSubject(int $subjectId): bool
    {
        return $this->subjects()->where('subject_id', $subjectId)->exists();
    }

    /**
     * Calculate attendance percentage.
     */
    public function getAttendancePercentage($startDate = null, $endDate = null)
    {
        $query = $this->attendanceRecords();
        
        if ($startDate) {
            $query->where('attendance_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('attendance_date', '<=', $endDate);
        }

        $total = $query->count();
        if ($total === 0) return 0;

        $present = $query->where('status', 'present')->count();
        return round(($present / $total) * 100, 2);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('teacher_status', 'active');
    }

    public function scopeByDepartment($query, int $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeFullTime($query)
    {
        return $query->where('employee_type', 'full-time');
    }
}
