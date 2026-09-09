<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrAttendanceLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'student_id',
        'scan_time',
        'device_info',
        'ip_address',
        'location',
        'status',
    ];

    protected $casts = [
        'scan_time' => 'datetime',
    ];

    /**
     * Boot function to handle automatic status determination
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($log) {
            // Auto-determine status based on scan time
            $session = $log->session;
            $scanTime = $log->scan_time ?? now();
            
            // Check if late (more than 15 minutes after start time)
            $startDateTime = $session->session_date->setTimeFromTimeString($session->start_time);
            $lateThreshold = $startDateTime->addMinutes(15);
            
            $log->status = $scanTime->greaterThan($lateThreshold) ? 'late' : 'present';
            
            // Increment session scan count
            $session->incrementScans();
        });
    }

    /**
     * Get the session this log belongs to
     */
    public function session()
    {
        return $this->belongsTo(QrAttendanceSession::class, 'session_id');
    }

    /**
     * Get the student who scanned
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Check if this scan was late
     */
    public function isLate(): bool
    {
        return $this->status === 'late';
    }

    /**
     * Scopes
     */
    public function scopeForSession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    public function scopeForStudent($query, $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }
}
