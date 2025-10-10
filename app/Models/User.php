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

    public function getIsAdminAttribute()
    {
        return $this->role === 'admin';
    }

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }
}
