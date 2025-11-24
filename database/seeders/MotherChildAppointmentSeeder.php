<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MotherProfile;
use App\Models\Facility;
use App\Models\Child;
use App\Models\Appointment;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class MotherChildAppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // --- Create HIS Manager at Provincial Office ---
        $provincialFacility = Facility::firstOrCreate(
            ['sub_district' => 'PROVINCE', 'type' => 'management'],
            [
                'name' => 'Provincial Health Office',
                'district_id' => null,
                'level_of_care' => 'Provincial Office',
            ]
        );

        $hisManager = User::firstOrCreate(
            ['email' => 'his_manager@province.gov'],
            [
                'name' => 'HIS Manager',
                'password' => Hash::make('HisM@nager123'),
                'role' => 'health_worker',
                'sub_role' => 'his_manager',
                'facility_id' => $provincialFacility->id,
                'district_id' => null,
                'is_active' => true,
            ]
        );

        $this->command->info('HIS Manager created at Provincial Office.');

        // --- Fetch facilities excluding management ---
        $facilities = Facility::where('type', '!=', 'management')->get();
        if ($facilities->isEmpty()) {
            $this->command->warn('No facilities available. Seeder skipped.');
            return;
        }

        $allMothers = collect();
        $allChildren = collect();

        // --- Create mother users + profiles ---
        foreach ($facilities as $facility) {
            $numMothers = rand(2, 6);
            for ($i = 0; $i < $numMothers; $i++) {
                $motherUser = User::create([
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('password123'),
                    'role' => 'mother',
                    'facility_id' => $facility->id,
                ]);

                MotherProfile::create([
                    'user_id' => $motherUser->id,
                    'dob' => $faker->date('Y-m-d', '-18 years'),
                    'contact_number' => $faker->phoneNumber,
                    'address' => $faker->address,
                    'last_menstrual_date' => $faker->date('Y-m-d', '-6 months'),
                    'trimester' => $faker->randomElement(['First', 'Second', 'Third']),
                ]);

                $allMothers->push($motherUser);

                // --- Create 1-2 children per mother ---
                $numChildren = rand(1, 2);
                for ($j = 0; $j < $numChildren; $j++) {
                    $child = Child::create([
                        'mother_id' => $motherUser->id,
                        'name' => $faker->firstName . ' ' . $faker->lastName,
                        'dob' => $faker->date('Y-m-d', '-5 years'),
                        'gender' => $faker->randomElement(['Male', 'Female']),
                    ]);
                    $allChildren->push($child);
                }
            }
        }

        $this->command->info("Created {$allMothers->count()} mothers and {$allChildren->count()} children.");

        // --- Fetch health workers ---
        $healthWorkers = User::whereIn('role', ['health_worker', 'midwife', 'facility_worker', 'facility_nurse', 'facility_doctor', 'hospital_admin', 'facility_admin', 'facility_manager'])
            ->orWhereIn('sub_role', ['midwife', 'facility_worker', 'facility_nurse', 'facility_doctor', 'hospital_admin', 'facility_admin', 'facility_manager'])
            ->get();

        $healthWorkersByFacility = $healthWorkers->groupBy('facility_id');

        $phases = ['prenatal', 'delivery', 'postnatal', 'vaccination'];
        $statuses = ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show'];
        $appointmentTypes = [
            'prenatal' => ['Routine Check-up', 'Ultrasound', 'Lab Work', 'First Trimester Check'],
            'delivery' => ['Delivery Appointment', 'Pre-delivery Assessment'],
            'postnatal' => ['Post-delivery Check-up', 'Follow-up Visit', 'Breastfeeding Support'],
            'vaccination' => ['Routine Immunization', 'Catch-up Vaccination', 'Booster Shot'],
        ];

        $appointments = [];
        $count = 0;

        // --- Create appointments ---
        foreach ($facilities as $facility) {
            $facilityMothers = $allMothers->where('facility_id', $facility->id);
            $facilityChildren = $allChildren->whereIn('mother_id', $facilityMothers->pluck('id'));

            $allowedRoles = match ($facility->level_of_care) {
                'Primary Health Care Center', 'PHC' => ['facility_worker', 'facility_nurse', 'facility_doctor'],
                'Dental Hospital', 'District Hospital', 'National Central Hospital', 'Tertiary Hospital', 'Specialized Hospital', 'Regional Hospital' => [
                    'midwife',
                    'facility_worker',
                    'facility_nurse',
                    'facility_doctor',
                    'hospital_admin',
                    'facility_admin',
                    'facility_manager'
                ],
                default => [],
            };

            $facilityHealthWorkers = $healthWorkersByFacility->get($facility->id)?->filter(function ($hw) use ($allowedRoles) {
                return in_array($hw->sub_role, $allowedRoles);
            }) ?? collect();

            foreach ($phases as $phase) {
                foreach ($statuses as $status) {
                    if ($facilityChildren->isEmpty() || $facilityMothers->isEmpty()) continue;

                    $child = $facilityChildren->random();
                    $mother = $facilityMothers->where('id', $child->mother_id)->first();
                    $healthWorker = $facilityHealthWorkers->isNotEmpty() ? $facilityHealthWorkers->random() : null;
                    $appointmentType = $appointmentTypes[$phase][array_rand($appointmentTypes[$phase])];

                    $date = match ($status) {
                        'scheduled' => now()->addDays(rand(1, 30))->toDateString(),
                        'completed', 'no_show' => now()->subDays(rand(1, 60))->toDateString(),
                        'cancelled' => now()->addDays(rand(1, 15))->toDateString(),
                        'rescheduled' => now()->subDays(rand(1, 30))->toDateString(),
                        default => now()->toDateString(),
                    };

                    $startTime = sprintf('%02d:%02d', rand(8, 16), [0, 30][array_rand([0, 30])]);
                    $endMinutes = (int) substr($startTime, 3) + 30;
                    $endHour = (int) substr($startTime, 0, 2) + (int) ($endMinutes / 60);
                    $endTime = sprintf('%02d:%02d', $endHour, $endMinutes % 60);

                    $appointments[] = [
                        'child_id' => $child->id,
                        'user_id' => $mother->id,
                        'date' => $date,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'type' => $appointmentType,
                        'phase' => $phase,
                        'status' => $status,
                        'location' => $facility->name . ' - Room ' . rand(1, 5),
                        'facility_id' => $facility->id,
                        'health_worker_id' => $healthWorker?->id ?? $hisManager->id,
                        'notes' => "Test appointment for {$phase} phase - Status: {$status}",
                        'clinical_notes' => $status === 'completed' ? 'Mother and baby in good health. Follow-up in 2 weeks.' : null,
                        'is_high_risk' => $status === 'completed' ? (rand(1, 10) > 7) : false,
                        'reminder_sent' => $status === 'scheduled' ? false : true,
                        'reschedule_reason' => $status === 'rescheduled' ? 'Patient requested reschedule' : null,
                        'reschedule_requested_at' => $status === 'rescheduled' ? now()->subDays(2) : null,
                        'reschedule_requested_by' => $status === 'rescheduled' ? $mother->id : null,
                    ];

                    $count++;
                    if ($count >= 50) {
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

        $this->command->info('Seeder completed: HIS Manager, Mothers, Children, and Appointments successfully created!');
    }
}
