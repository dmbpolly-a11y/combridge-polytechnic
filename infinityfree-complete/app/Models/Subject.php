<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'department_id',
        'description',
        'credit_hours',
        'type',
        'status',
    ];

    protected $casts = [
        'credit_hours' => 'integer',
    ];

    /**
     * Get the department that owns this subject.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the programmes that include this subject.
     */
    public function programmes()
    {
        return $this->belongsToMany(Programme::class, 'programme_subject')
            ->withPivot('year', 'semester', 'is_required')
            ->withTimestamps();
    }

    /**
     * Get the teachers assigned to this subject.
     */
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'subject_teacher')
            ->withPivot('class_id', 'academic_year')
            ->withTimestamps();
    }

    /**
     * Get the examinations for this subject.
     */
    public function examinations()
    {
        return $this->hasMany(Examination::class);
    }

    /**
     * Get the timetable entries for this subject.
     */
    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

    /**
     * Get the books related to this subject.
     */
    public function books()
    {
        return $this->hasMany(Book::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
