<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vaccination extends Model
{
    protected $fillable = [
        'child_id',
        'facility_id',
        'vaccine_name',
        'date',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
