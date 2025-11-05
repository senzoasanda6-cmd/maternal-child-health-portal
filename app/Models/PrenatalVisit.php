<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PrenatalVisit extends Model
{
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function child()
    {
        return $this->belongsTo(Child::class);
    }

    public function immunizations()
    {
        return $this->morphMany(Immunization::class, 'visitable');
    }
}
