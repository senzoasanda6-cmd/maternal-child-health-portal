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
        // Hospital-level health worker sub-roles
        $hospitalRoles = [
            'midwife',
            'facility_worker',
            'facility_nurse',
            'facility_doctor',
            'facility_manager',
        ];

        // PHC-level health worker sub-roles
        $phcRoles = [
            'facility_worker',
            'facility_nurse',
            'facility_doctor',
        ];

        // Facility Level-of-Care Mapping
        $hospitalLevels = [
            'Dental Hospital',
            'District Hospital',
            'National Central Hospital',
            'Tertiary Hospital',
            'Specialized Hospital',
            'Regional Hospital',
        ];

        $phcLevel = 'PHC Clinic';

        $facilities = Facility::all();

        foreach ($facilities as $facility) {

            // Skip management facilities entirely
            if ($facility->type === 'management') {
                continue;
            }

            // Decide roles based on facility level of care
            if (in_array($facility->level_of_care, $hospitalLevels)) {
                $roles = $hospitalRoles;
            } elseif ($facility->level_of_care === $phcLevel) {
                $roles = $phcRoles;
            } else {
                continue; // Unknown level of care → no workers
            }

            // Seed workers for this facility
            foreach ($roles as $role) {

                $email = strtolower(str_replace(' ', '_', $role)) . "_{$facility->id}@example.com";

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

        
        // Seed HIS Manager (Provincial-level health information manager)
        
        $provinceFacility = Facility::where('type', 'management')
            ->where('level_of_care', 'Head Office')
            ->first();

        if (!$provinceFacility) {
            // fallback: any management office
            $provinceFacility = Facility::where('type', 'management')->first();
        }

        if ($provinceFacility) {
            User::updateOrCreate(
                ['email' => 'his_manager@gauteng.gov.za'],
                [
                    'name' => 'HIS Manager',
                    'password' => Hash::make('HisM@nager123'),
                    'role'       => 'health_worker',
                    'sub_role'   => 'his_manager',
                    'facility_id' => $provinceFacility->id,
                    'district_id' => $provinceFacility->district_id,
                    'is_active'  => true,
                ]
            );

            $this->command->info('HIS Manager assigned to Provincial Office.');
        }

        $this->command->info('Health worker roles seeded successfully.');
    }
}
