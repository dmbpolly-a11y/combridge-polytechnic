<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'admission_number',
        'programme_id',
        'class_id',
        'admission_date',
        'guardian_name',
        'guardian_phone',
        'guardian_email',
        'guardian_address',
        'previous_school',
        'national_id',
        'passport_number',
        'blood_group',
        'medical_conditions',
        'emergency_contact',
        'student_status',
    ];

    protected $casts = [
        'admission_date' => 'date',
    ];

    /**
     * Get the user record associated with the student.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the programme the student is enrolled in.
     */
    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }

    /**
     * Get the class the student belongs to.
     */
    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the attendance records for the student.
     */
    public function attendanceRecords()
    {
        return $this->hasMany(StudentAttendance::class);
    }

    /**
     * Get the exam results for the student.
     */
    public function examResults()
    {
        return $this->hasMany(ExamResult::class);
    }

    /**
     * Get the fee payments made by the student.
     */
    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    /**
     * Get the fee balance for the student.
     */
    public function feeBalances()
    {
        return $this->hasMany(FeeBalance::class);
    }

    /**
     * Get the books issued to the student.
     */
    public function bookIssues()
    {
        return $this->hasMany(BookIssue::class);
    }

    /**
     * Get current fee balance for the student.
     */
    public function getCurrentBalance(string $academicYear)
    {
        return $this->feeBalances()
            ->where('academic_year', $academicYear)
            ->first();
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
        return $query->where('student_status', 'active');
    }

    public function scopeByProgramme($query, int $programmeId)
    {
        return $query->where('programme_id', $programmeId);
    }

    public function scopeByClass($query, int $classId)
    {
        return $query->where('class_id', $classId);
    }
}
