<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'hospital_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $dates = ['deleted_at'];

    protected $appends = ['is_admin'];

    // Accessor for is_admin attribute
    public function getIsAdminAttribute()
    {
        return $this->role === 'admin';
    }

    // Helper methods for role checks
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isHealthWorker(): bool
    {
        return $this->role === 'health_worker';
    }

    public function isMother(): bool
    {
        return $this->role === 'mother';
    }

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }
    public function motherProfile()
    {
        return $this->hasOne(MotherProfile::class);
    }
}
