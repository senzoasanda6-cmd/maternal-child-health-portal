<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Facility;
use App\Models\Child;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get test data
        $facilities = Facility::all();
        $children = Child::all();
        $mothers = User::where('role', 'mother')->limit(5)->get();
        $healthWorkers = User::whereIn('role', ['health_worker', 'midwife', 'nurse', 'doctor'])
            ->orWhereIn('sub_role', ['midwife', 'nurse', 'doctor'])
            ->limit(10)
            ->get();

        if ($facilities->isEmpty() || $children->isEmpty() || $mothers->isEmpty()) {
            $this->command->warn('Not enough test data to seed appointments. Run other seeders first.');
            return;
        }

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

        // Create appointments for different scenarios
        foreach ($facilities->take(5) as $facility) {
            foreach ($phases as $phase) {
                foreach ($statuses as $status) {
                    if ($children->isEmpty() || $mothers->isEmpty()) {
                        break;
                    }

                    $child = $children->random();
                    $mother = $mothers->random();
                    $healthWorker = $healthWorkers->isNotEmpty() ? $healthWorkers->random() : null;
                    $appointmentType = $appointmentTypes[$phase][array_rand($appointmentTypes[$phase])];

                    // Vary dates based on status
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

                    $appointment = [
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
                        'health_worker_id' => $healthWorker?->id,
                        'notes' => "Test appointment for {$phase} phase - Status: {$status}",
                        'clinical_notes' => $status === 'completed' ? 'Mother and baby in good health. Follow-up in 2 weeks.' : null,
                        'is_high_risk' => $status === 'completed' ? (rand(1, 10) > 7 ? true : false) : false,
                        'reminder_sent' => $status === 'scheduled' ? false : true,
                        'reschedule_reason' => $status === 'rescheduled' ? 'Patient requested reschedule due to schedule conflict' : null,
                        'reschedule_requested_at' => $status === 'rescheduled' ? now()->subDays(2) : null,
                        'reschedule_requested_by' => $status === 'rescheduled' ? $mother->id : null,
                    ];

                    $appointments[] = $appointment;
                    $count++;

                    // Batch insert every 50 records
                    if ($count >= 50) {
                        Appointment::insert($appointments);
                        $appointments = [];
                        $this->command->info("Inserted {$count} appointments...");
                        $count = 0;
                    }
                }
            }
        }

        // Insert remaining appointments
        if (!empty($appointments)) {
            Appointment::insert($appointments);
            $this->command->info("Inserted final batch of " . count($appointments) . " appointments");
        }

        // Create additional realistic test appointments
        $additionalAppointments = [];

        // Upcoming scheduled appointments for mothers
        for ($i = 0; $i < 10; $i++) {
            $child = $children->random();
            $mother = $mothers->random();
            $facility = $facilities->random();
            $healthWorker = $healthWorkers->isNotEmpty() ? $healthWorkers->random() : null;
            $phase = $phases[array_rand($phases)];
            $appointmentType = $appointmentTypes[$phase][array_rand($appointmentTypes[$phase])];

            $additionalAppointments[] = [
                'child_id' => $child->id,
                'user_id' => $mother->id,
                'date' => now()->addDays(rand(1, 60))->toDateString(),
                'start_time' => sprintf('%02d:00', rand(8, 16)),
                'end_time' => sprintf('%02d:30', rand(8, 16)),
                'type' => $appointmentType,
                'phase' => $phase,
                'status' => 'scheduled',
                'location' => $facility->name . ' - OPD',
                'facility_id' => $facility->id,
                'health_worker_id' => $healthWorker?->id,
                'notes' => "Scheduled {$phase} appointment",
                'clinical_notes' => null,
                'is_high_risk' => false,
                'reminder_sent' => false,
                'reschedule_reason' => null,
                'reschedule_requested_at' => null,
                'reschedule_requested_by' => null,
            ];
        }

        // Recent completed appointments with clinical notes
        for ($i = 0; $i < 10; $i++) {
            $child = $children->random();
            $mother = $mothers->random();
            $facility = $facilities->random();
            $healthWorker = $healthWorkers->isNotEmpty() ? $healthWorkers->random() : null;
            $phase = $phases[array_rand($phases)];
            $appointmentType = $appointmentTypes[$phase][array_rand($appointmentTypes[$phase])];

            $additionalAppointments[] = [
                'child_id' => $child->id,
                'user_id' => $mother->id,
                'date' => now()->subDays(rand(1, 30))->toDateString(),
                'start_time' => sprintf('%02d:00', rand(8, 16)),
                'end_time' => sprintf('%02d:30', rand(8, 16)),
                'type' => $appointmentType,
                'phase' => $phase,
                'status' => 'completed',
                'location' => $facility->name . ' - Clinic Room',
                'facility_id' => $facility->id,
                'health_worker_id' => $healthWorker?->id,
                'notes' => "Completed {$phase} appointment",
                'clinical_notes' => 'All vitals normal. Mother in good health. Child developing normally. Next visit in 4 weeks.',
                'is_high_risk' => rand(1, 10) > 8 ? true : false,
                'reminder_sent' => true,
                'reschedule_reason' => null,
                'reschedule_requested_at' => null,
                'reschedule_requested_by' => null,
            ];
        }

        if (!empty($additionalAppointments)) {
            Appointment::insert($additionalAppointments);
            $this->command->info("Inserted " . count($additionalAppointments) . " additional appointments");
        }

        $this->command->info('Appointment seeding completed successfully!');
        $this->command->info('Total appointments created: ' . (count($appointments) + count($additionalAppointments)));
    }
}
