<?php

namespace App\Policies;

use App\Models\User;
use App\Models\RegistrationRequest;

class RegistrationRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        // Only users with the 'admin' role can view registration requests.
        return $user->role === 'admin';
    }
}
