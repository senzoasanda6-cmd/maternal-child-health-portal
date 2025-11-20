<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'start',
        'end',
        'facility_id',
        'facility_name',
        'care_type',
        'status',
        'recurrence',
        'recurrence_days',
    ];

    protected $casts = [
        'recurrence_days' => 'array', // JSON array
        'start' => 'datetime',
        'end' => 'datetime',
    ];

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
