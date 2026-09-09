<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'head_of_department_id',
        'status',
    ];

    /**
     * Get the head of department.
     */
    public function headOfDepartment()
    {
        return $this->belongsTo(User::class, 'head_of_department_id');
    }

    /**
     * Get the programmes in this department.
     */
    public function programmes()
    {
        return $this->hasMany(Programme::class);
    }

    /**
     * Get the subjects in this department.
     */
    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    /**
     * Get the teachers in this department.
     */
    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
