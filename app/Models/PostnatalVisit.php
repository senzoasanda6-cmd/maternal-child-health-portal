<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostnatalVisit extends Model
{
    public function child()
    {
        return $this->belongsTo(Child::class);
    }
    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

}
