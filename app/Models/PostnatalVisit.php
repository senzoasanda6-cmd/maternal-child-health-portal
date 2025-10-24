<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostnatalVisit extends Model
{
    protected $fillable = [
        'child_id',
        'facility_id',
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

}
