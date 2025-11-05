<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Immunization extends Model
{
    protected $fillable = [
        'visit_id',
        'vaccine_name',
        'dose',
        'scheduled_on',
        'administered_on',
        'notes',
    ];

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }
    public function visitable()
    {
        return $this->morphTo();
    }
}
