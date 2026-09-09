<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Programme extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'department_id',
        'description',
        'duration_years',
        'level',
        'tuition_fee',
        'status',
    ];

    protected $casts = [
        'tuition_fee' => 'decimal:2',
        'duration_years' => 'integer',
    ];

    /**
     * Get the department that owns this programme.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the subjects for this programme.
     */
    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'programme_subject')
            ->withPivot('year', 'semester', 'is_required')
            ->withTimestamps();
    }

    /**
     * Get the classes for this programme.
     */
    public function classes()
    {
        return $this->hasMany(SchoolClass::class);
    }

    /**
     * Get the students enrolled in this programme.
     */
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Get the fee structures for this programme.
     */
    public function feeStructures()
    {
        return $this->hasMany(FeeStructure::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByLevel($query, string $level)
    {
        return $query->where('level', $level);
    }
}
