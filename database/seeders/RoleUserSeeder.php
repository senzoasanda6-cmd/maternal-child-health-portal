<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Facility;

class RoleUserSeeder extends Seeder
{
    public function run(): void
    {
        // Define primary roles with distinct portals
        $primaryRoles = [
            'mother',
            'health_worker',
            'admin',
            'district_admin',
        ];

        // Define sub-roles that map to health_worker portal
        $subRoles = [
            'midwife',
            'facility_worker',
            'facility_nurse',
            'facility_doctor',
            'hospital_admin',
            'facility_admin',
            'facility_manager',
            'his_manager',
        ];

        // Get a random facility with a valid district
        $facility = Facility::whereNotNull('district_id')->inRandomOrder()->first();

        if (!$facility) {
            $this->command->warn('No facilities with district_id found. Skipping role user seeding.');
            return;
        }

        // Seed primary roles
        foreach ($primaryRoles as $role) {
            User::updateOrCreate(
                ['email' => "$role@example.com"],
                [
                    'name' => ucfirst(str_replace('_', ' ', $role)),
                    'password' => Hash::make('password'),
                    'role' => $role,
                    'facility_id' => $facility->id,
                    'district_id' => $facility->district_id,
                    'is_active' => true,
                ]
            );
        }

        // Seed sub-roles as health_worker variants
        foreach ($subRoles as $subRole) {
            User::updateOrCreate(
                ['email' => "$subRole@example.com"],
                [
                    'name' => ucfirst(str_replace('_', ' ', $subRole)),
                    'password' => Hash::make('password'),
                    'role' => $subRole,
                    'facility_id' => $facility->id,
                    'district_id' => $facility->district_id,
                    'is_active' => true,
                ]
            );
        }

        // Seed HIS Manager with provincial district
        User::updateOrCreate(
            ['email' => 'his_manager@gauteng.gov.za'],
            [
                'name' => 'HIS Manager',
                'password' => Hash::make('HisM@nager123'),
                'role' => 'health_worker',
                'sub_role' => 'his_manager',
                'district_id' => $facility->district_id,
                'facility_id' => $facility->id,
                'is_active' => true,
            ]
        );

        $this->command->info('Primary and sub-role users seeded successfully.');
    }
}
