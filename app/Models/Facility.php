<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    protected $fillable = [
        'name',
        'title',
        'district',
        'sub_district',
        'type',
        'level_of_care',
    ];
}
