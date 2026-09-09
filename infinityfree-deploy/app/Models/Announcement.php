<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'target_audience',
        'class_id',
        'posted_by',
        'publish_date',
        'expiry_date',
        'priority',
        'status',
    ];

    protected $casts = [
        'publish_date' => 'date',
        'expiry_date' => 'date',
    ];

    /**
     * Boot function to auto-update status.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($announcement) {
            // Auto-expire announcements
            if ($announcement->expiry_date && Carbon::today()->greaterThan($announcement->expiry_date)) {
                $announcement->status = 'expired';
            }
        });
    }

    /**
     * Get the user who posted the announcement.
     */
    public function postedBy()
    {
        return $this->belongsTo(User::class, 'posted_by');
    }

    /**
     * Get the class if announcement is for a specific class.
     */
    public function class()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    /**
     * Check if announcement is active.
     */
    public function isActive(): bool
    {
        if ($this->status !== 'published') {
            return false;
        }

        if ($this->expiry_date && Carbon::today()->greaterThan($this->expiry_date)) {
            return false;
        }

        return Carbon::today()->greaterThanOrEqualTo($this->publish_date);
    }

    /**
     * Scopes
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where('publish_date', '<=', Carbon::today())
            ->where(function ($q) {
                $q->whereNull('expiry_date')
                  ->orWhere('expiry_date', '>=', Carbon::today());
            });
    }

    public function scopeByAudience($query, string $audience)
    {
        return $query->where('target_audience', $audience);
    }

    public function scopeByPriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('publish_date', '>=', Carbon::today()->subDays($days));
    }
}
