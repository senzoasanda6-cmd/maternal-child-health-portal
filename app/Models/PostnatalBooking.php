<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostnatalBooking extends Model
{
    protected $fillable = [
        'fullName',
        'preferredDate',
        'preferredTime',
        'location',
        'reason',
        'email',
    ];
}
