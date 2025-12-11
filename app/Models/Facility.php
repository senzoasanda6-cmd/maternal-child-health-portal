<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'district_id',
        'sub_district',
        'type',
        'level_of_care',
    ];

    // Relationships
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }
    public function mothers()
    {
        return $this->hasMany(Mother::class);
    }
    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
