<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistrationRequest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'role',
        'facility_id',
        'district',
        'comments',
        'status',
    ];
    // app/Models/RegistrationRequest.php

    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }
}
