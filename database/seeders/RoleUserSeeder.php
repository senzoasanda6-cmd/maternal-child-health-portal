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
        // Facility role mappings
        $hospitalRoles = [
            'midwife',
            'facility_worker',
            'facility_nurse',
            'facility_doctor',
            'hospital_admin',
            'facility_admin',
            'facility_manager',
        ];

        $phcRoles = [
            'facility_worker',
            'facility_nurse',
            'facility_doctor',
        ];

        // High-level hospital types
        $hospitalLevels = [
            'Dental Hospital',
            'District Hospital',
            'National Central Hospital',
            'Tertiary Hospital',
            'Specialized Hospital',
            'Regional Hospital',
        ];

        // Fetch all facilities once
        $facilities = Facility::all();

        foreach ($facilities as $facility) {

            // Skip management facilities
            if ($facility->type === 'management') continue;

            // Assign roles based on level of care
            $roles = in_array($facility->level_of_care, $hospitalLevels)
                ? $hospitalRoles
                : ($facility->level_of_care === 'Primary Health Care' ? $phcRoles : []);

            if (empty($roles)) continue;

            foreach ($roles as $role) {
                $email = strtolower(str_replace(' ', '_', $role) . '_' . $facility->id . '@example.com');
                User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => ucfirst(str_replace('_', ' ', $role)) . ' - ' . $facility->name,
                        'password' => Hash::make('password'),
                        'role' => 'health_worker',
                        'sub_role' => $role,
                        'facility_id' => $facility->id,
                        'district_id' => $facility->district_id,
                        'is_active' => true,
                    ]
                );
            }
        }

        // HIS Manager - provincial level
        $provincialFacility = Facility::where('sub_district', 'Province')->inRandomOrder()->first();
        if ($provincialFacility) {
            User::updateOrCreate(
                ['email' => 'his_manager@gauteng.gov.za'],
                [
                    'name' => 'HIS Manager',
                    'password' => Hash::make('HisM@nager123'),
                    'role' => 'health_worker',
                    'sub_role' => 'his_manager',
                    'facility_id' => $provincialFacility->id,
                    'district_id' => $provincialFacility->district_id,
                    'is_active' => true,
                ]
            );
            $this->command->info('HIS Manager seeded at Provincial Office.');
        }

        $this->command->info('All health worker users seeded according to facility level of care.');
    }
}
