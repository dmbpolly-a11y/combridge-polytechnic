<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'academic_year',
        'total_fee',
        'paid_amount',
        'balance',
    ];

    protected $casts = [
        'total_fee' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    /**
     * Get the student for this balance record.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Update balance after payment.
     */
    public function updateBalance(float $paymentAmount): void
    {
        $this->paid_amount += $paymentAmount;
        $this->balance = $this->total_fee - $this->paid_amount;
        $this->save();
    }

    /**
     * Check if fees are fully paid.
     */
    public function isFullyPaid(): bool
    {
        return $this->balance <= 0;
    }

    /**
     * Get payment percentage.
     */
    public function getPaymentPercentageAttribute()
    {
        if ($this->total_fee == 0) return 0;
        
        return round(($this->paid_amount / $this->total_fee) * 100, 2);
    }

    /**
     * Scopes
     */
    public function scopeWithBalance($query)
    {
        return $query->where('balance', '>', 0);
    }

    public function scopeFullyPaid($query)
    {
        return $query->where('balance', '<=', 0);
    }

    public function scopeByAcademicYear($query, string $academicYear)
    {
        return $query->where('academic_year', $academicYear);
    }
}
