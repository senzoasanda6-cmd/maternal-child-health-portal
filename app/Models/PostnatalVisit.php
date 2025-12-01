<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostnatalVisit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'child_id',
        'mother_id',
        'visit_date',
        'weight',
        'blood_pressure',
        'temperature',
        'notes',
    ];

    public function mother(): BelongsTo
    {
        return $this->belongsTo(User::class, 'mother_id');
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }
}