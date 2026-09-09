<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'room_number',
        'room_type',
        'capacity',
        'facilities',
        'status',
    ];

    protected $casts = [
        'capacity' => 'integer',
    ];

    /**
     * Get the timetable entries for this room.
     */
    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

    /**
     * Check if room is available at a specific time.
     */
    public function isAvailable(string $dayOfWeek, string $startTime, string $endTime, ?int $timetableId = null): bool
    {
        $query = $this->timetables()
            ->where('day_of_week', $dayOfWeek)
            ->where('status', 'active')
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                  ->orWhereBetween('end_time', [$startTime, $endTime])
                  ->orWhere(function ($q2) use ($startTime, $endTime) {
                      $q2->where('start_time', '<=', $startTime)
                         ->where('end_time', '>=', $endTime);
                  });
            });

        if ($timetableId) {
            $query->where('id', '!=', $timetableId);
        }

        return !$query->exists();
    }

    /**
     * Scopes
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('room_type', $type);
    }
}
