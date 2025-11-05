<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'user_id',
        'child_id',
        'facility_id',
        'provider_id',
        'visit_type',
        'visit_date',
        'notes',
    ];

    public function child()
    {
        return $this->belongsTo(Child::class);
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function provider()
    {
        return $this->belongsTo(User::class, 'provider_id');
    }

    public function immunizations()
    {
        return $this->hasMany(Immunization::class);
    }
}
