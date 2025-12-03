<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Milestone;


class Mother extends Model
{
    public function children()
    {
        return $this->hasMany(Child::class, 'mother_id');
    }
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
