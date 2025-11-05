<?php

namespace App\Policies;

use App\Models\Facility;
use App\Models\User;

class FacilityPolicy
{
    public function view(User $user, Facility $facility): bool
    {
        if (in_array($user->role, ['hospital_admin', 'facility_admin', 'facility_manager'])) {
            return $user->facility_id === $facility->id;
        }

        if ($user->role === 'district_admin') {
            return $user->district_id === $facility->district_id;
        }

        return $user->role === 'admin'; // full access
    }

    public function update(User $user, Facility $facility): bool
    {
        return $this->view($user, $facility); // same logic
    }

    public function delete(User $user, Facility $facility): bool
    {
        return $user->role === 'admin'; // only system admins can delete
    }
}
