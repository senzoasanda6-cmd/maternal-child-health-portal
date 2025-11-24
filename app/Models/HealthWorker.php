<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HealthWorker extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'role',
        'facility_id',
    ];

    /**
     * Get the facility this health worker belongs to
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
