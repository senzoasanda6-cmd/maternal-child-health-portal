<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'child_id',
        'user_id',
        'date',
        'type',
        'notes',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function facility()
{
    return $this->belongsTo(Facility::class);
}

}
