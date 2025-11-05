<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\User
 *
 * @property int|null $facility_id
 * @property string $role
 * @property string|null $sub_role
 * @property string|null $designation
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'sub_role',
        'designation',
        'facility_id',
        'is_active',
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

    public function isCentralAdmin(): bool
    {
        return $this->role === 'central_admin';
    }

    public function isDistrictAdmin(): bool
    {
        return $this->role === 'district_admin';
    }

    // Relationships
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    public function children()
    {
        return $this->hasMany(Child::class);
    }

    public function motherProfile()
    {
        return $this->hasOne(MotherProfile::class);
    }
    public function isMidwife(): bool
    {
        return $this->role === 'health_worker' && $this->sub_role === 'midwife';
    }

    public function isNurse(): bool
    {
        return $this->role === 'health_worker' && $this->sub_role === 'nurse';
    }
    public function district()
    {
        return $this->belongsTo(District::class); // if applicable
    }
}
