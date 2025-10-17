<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationRequest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'role',
        'hospital_id',
        'comments',
        'status',
    ];
}
