<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrAttendanceSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id',
        'subject_id',
        'teacher_id',
        'session_code',
        'session_date',
        'start_time',
        'end_time',
        'status',
        'total_scans',
    ];

    protected $casts = [
        'session_date' => 'date',
        'total_scans' => 'integer',
    ];

    /**
     * Get the class for this session
     */
    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Get the subject for this session
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the teacher for this session
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    /**
     * Get all attendance logs for this session
     */
    public function logs()
    {
        return $this->hasMany(QrAttendanceLog::class, 'session_id');
    }

    /**
     * Check if session is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if session is expired
     */
    public function isExpired(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->end_time) {
            $endDateTime = $this->session_date->setTimeFromTimeString($this->end_time);
            return now()->greaterThan($endDateTime);
        }

        return false;
    }

    /**
     * Increment scan count
     */
    public function incrementScans(): void
    {
        $this->increment('total_scans');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('session_date', $date);
    }

    public function scopeForClass($query, $classId)
    {
        return $query->where('class_id', $classId);
    }
}
