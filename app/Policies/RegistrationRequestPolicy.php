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

    /**
     * Determine whether the user can update (approve) the given registration request.
     * Only admins are allowed to approve registration requests.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\RegistrationRequest  $registrationRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, RegistrationRequest $registrationRequest)
    {
        return $user->role === 'admin';
    }
}
