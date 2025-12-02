<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MotherProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dob',
        'contact_number',
        'address',
        'last_menstrual_date',
        'trimester',
    ];

    protected $casts = [
        'dob' => 'date',
        'last_menstrual_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function children()
    {
        return $this->hasManyThrough(Child::class, User::class, 'id', 'mother_id', 'user_id', 'id');
    }
}
