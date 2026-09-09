<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'programme_id',
        'year',
        'amount',
        'frequency',
        'fee_type',
        'is_mandatory',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'year' => 'integer',
        'is_mandatory' => 'boolean',
    ];

    /**
     * Get the programme this fee structure belongs to.
     */
    public function programme()
    {
        return $this->belongsTo(Programme::class);
    }

    /**
     * Get the fee payments associated with this structure.
     */
    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeMandatory($query)
    {
        return $query->where('is_mandatory', true);
    }

    public function scopeByProgramme($query, int $programmeId)
    {
        return $query->where('programme_id', $programmeId);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('year', $year);
    }
}
