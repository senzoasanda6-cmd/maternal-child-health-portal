<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'details',
        'performed_by',
    ];

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
