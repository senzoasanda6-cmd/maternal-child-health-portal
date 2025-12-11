<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

use App\Models\User;
use App\Models\Facility;
use App\Models\MotherProfile;
use App\Models\Child;
use App\Models\Appointment;

class MegaSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('en_ZA'); // South African localized names (more realistic)

        /*
        |--------------------------------------------------------------------------
        | 1. Seed Health Workers (Improved RoleUserSeeder)
        |--------------------------------------------------------------------------
        */

        $hospitalLevels = [
            'Dental Hospital',
            'District Hospital',
            'National Central Hospital',
            'Tertiary Hospital',
            'Specialized Hospital',
            'Regional Hospital',
        ];

        $hospitalRoles = [
            'midwife',
            'facility_nurse',
            'facility_doctor',
            'facility_worker',
            'facility_manager',
            'facility_admin',
        ];

        $phcRoles = [
            'facility_worker',
            'facility_nurse',
            'facility_doctor',
        ];

        $phcLevel = 'PHC Clinic';

        $facilities = Facility::all();

        foreach ($facilities as $facility) {

            // skip provincial offices, handled later
            if ($facility->type === 'management') {
                continue;
            }

            if (in_array($facility->level_of_care, $hospitalLevels)) {
                $roles = $hospitalRoles;
            } elseif ($facility->level_of_care === $phcLevel) {
                $roles = $phcRoles;
            } else {
                continue;
            }

            foreach ($roles as $role) {

                $email = strtolower($role) . '_' . $facility->id . '@health.gov';

                User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => ucfirst(str_replace('_', ' ', $role)) . " " . $faker->lastName,
                        'password' => Hash::make('Password123!'),
                        'role' => 'health_worker',
                        'sub_role' => $role,
                        'facility_id' => $facility->id,
                        'district_id' => $facility->district_id,
                        'is_active' => true,
                    ]
                );
            }
        }

        // CREATE HIS MANAGER (single official)
        $managementFacility = Facility::where('type', 'management')->first();

        $hisManager = User::updateOrCreate(
            ['email' => 'his.manager@gauteng.gov.za'],
            [
                'name' => 'Provincial HIS Manager',
                'password' => Hash::make('HisM@nager123'),
                'role' => 'health_worker',
                'sub_role' => 'his_manager',
                'facility_id' => $managementFacility->id ?? null,
                'district_id' => $managementFacility->district_id ?? null,
                'is_active' => true,
            ]
        );

        $this->command->info("Health workers + HIS manager seeded.");

        /*
        |--------------------------------------------------------------------------
        | 2. Seed Mothers + Children (Realistic Names)
        |--------------------------------------------------------------------------
        */

        $nonManagementFacilities = $facilities->filter(fn($f) => $f->type !== 'management');

        $allMothers = collect();
        $allChildren = collect();

        foreach ($nonManagementFacilities as $facility) {

            $motherCount = rand(4, 10); // more realistic

            for ($i = 0; $i < $motherCount; $i++) {

                $mother = User::create([
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('Mother123!'),
                    'role' => 'mother',
                    'facility_id' => $facility->id,
                ]);

                MotherProfile::create([
                    'user_id' => $mother->id,
                    'dob' => $faker->date('Y-m-d', '-25 years'),
                    'contact_number' => $faker->phoneNumber,
                    'address' => $faker->streetAddress,
                    'last_menstrual_date' => now()->subMonths(rand(1, 7)),
                    'trimester' => $faker->randomElement(['First', 'Second', 'Third']),
                ]);

                $allMothers->push($mother);

                // 1–3 children per mother
                $childrenCount = rand(1, 3);

                for ($j = 0; $j < $childrenCount; $j++) {
                    $child = Child::create([
                        'mother_id' => $mother->id,
                        'name' => $faker->firstName . " " . $faker->lastName,
                        'dob' => now()->subYears(rand(1, 7)),
                        'gender' => $faker->randomElement(['Male', 'Female']),
                    ]);

                    $allChildren->push($child);
                }
            }
        }

        $this->command->info("Created {$allMothers->count()} mothers & {$allChildren->count()} children.");

        /*
        |--------------------------------------------------------------------------
        | 3. Seed Appointments (High-Quality, Realistic)
        |--------------------------------------------------------------------------
        */

        $phases = ['prenatal', 'delivery', 'postnatal', 'vaccination'];

        $statuses = ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show'];

        $appointmentTypes = [
            'prenatal' => ['Routine Check-up', 'Ultrasound', 'Blood Pressure Monitoring', 'Lab Tests'],
            'delivery' => ['Delivery Assessment', 'Labour Evaluation'],
            'postnatal' => ['Postnatal Check', 'Follow-up Visit', 'Breastfeeding Assessment'],
            'vaccination' => ['Routine Immunization', 'Booster Dose', 'Catch-up Vaccination'],
        ];

        $healthWorkersByFacility = User::where('role', 'health_worker')
            ->get()
            ->groupBy('facility_id');

        $appointments = [];
        $batchSize = 100;
        $count = 0;

        foreach ($nonManagementFacilities as $facility) {

            $facilityMothers = $allMothers->where('facility_id', $facility->id);
            $facilityChildren = $allChildren->whereIn('mother_id', $facilityMothers->pluck('id'));
            $facilityWorkers = $healthWorkersByFacility->get($facility->id) ?? collect();

            if ($facilityChildren->isEmpty()) continue;

            foreach ($phases as $phase) {
                foreach ($statuses as $status) {

                    $child = $facilityChildren->random();
                    $mother = $child->mother;  // guaranteed correct linkage
                    $worker = $facilityWorkers->random() ?? $hisManager;

                    // date logic
                    $date = match ($status) {
                        'scheduled' => now()->addDays(rand(3, 30)),
                        'completed' => now()->subDays(rand(3, 60)),
                        'cancelled' => now()->addDays(rand(1, 14)),
                        'rescheduled' => now()->subDays(rand(1, 20)),
                        'no_show' => now()->subDays(rand(1, 15)),
                        default => now(),
                    };

                    // realistic time slots
                    $hour = rand(8, 15);
                    $minute = rand(0, 1) ? '00' : '30';
                    $start = "$hour:$minute";
                    $end = date('H:i', strtotime("+30 minutes", strtotime($start)));

                    // realistic clinical notes
                    $clinical = match ($phase) {
                        'prenatal' => "BP normal. Fetal heart rate stable. Follow-up in 2 weeks.",
                        'delivery' => "Mother stable. Labour progressing normally.",
                        'postnatal' => "Mother recovering well. Baby breastfeeding successfully.",
                        'vaccination' => "Vaccine administered with no immediate adverse reactions.",
                        default => null
                    };

                    $appointments[] = [
                        'child_id' => $child->id,
                        'user_id' => $mother->id,
                        'facility_id' => $facility->id,
                        'health_worker_id' => $worker->id,
                        'phase' => $phase,
                        'type' => $faker->randomElement($appointmentTypes[$phase]),
                        'status' => $status,
                        'date' => $date->toDateString(),
                        'start_time' => $start,
                        'end_time' => $end,
                        'location' => $facility->name . ' – Room ' . rand(1, 6),
                        'notes' => ucfirst($phase) . " appointment (" . $status . ")",
                        'clinical_notes' => $status === 'completed' ? $clinical : null,
                        'is_high_risk' => ($phase === 'prenatal' || $phase === 'delivery') ? rand(1, 10) > 8 : false,
                        'reminder_sent' => $status !== 'scheduled',
                        'reschedule_reason' => $status === 'rescheduled' ? 'Mother requested alternative date.' : null,
                        'reschedule_requested_at' => $status === 'rescheduled' ? now()->subDay() : null,
                        'reschedule_requested_by' => $status === 'rescheduled' ? $mother->id : null,
                    ];

                    $count++;

                    if ($count >= $batchSize) {
                        Appointment::insert($appointments);
                        $appointments = [];
                        $count = 0;
                    }
                }
            }
        }

        if (!empty($appointments)) {
            Appointment::insert($appointments);
        }

        $this->command->info("All appointments created successfully.");
    }
}
