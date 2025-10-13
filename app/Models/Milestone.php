<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    public function mother()
    {
        return $this->belongsTo(Mother::class);
    }
}
