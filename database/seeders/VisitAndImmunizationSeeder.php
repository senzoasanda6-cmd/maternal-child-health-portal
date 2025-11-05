<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Child;
use App\Models\Facility;
use App\Models\PrenatalVisit;
use App\Models\PostnatalVisit;
use App\Models\Immunization;
use Carbon\Carbon;

class VisitAndImmunizationSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure user exists
        $user = User::first() ?? User::factory()->create([
            'name' => 'Test Mother',
            'email' => 'mother@example.com',
            'password' => bcrypt('password'),
        ]);

        $child = Child::factory()->create([
            'mother_id' => $user->id,
        ]);

        // Ensure child exists
        $child = Child::first() ?? Child::factory()->create([
            'name' => 'Test Baby',
            'birth_date' => Carbon::now()->subMonths(2),
            'gender' => 'female',
            'user_id' => $user->id,
        ]);

        // Use an existing facility
        $facility = Facility::inRandomOrder()->first();

        if (!$facility) {
            throw new \Exception('No facilities found in the database. Please seed facilities first.');
        }


        // Create a prenatal visit
        $prenatal = PrenatalVisit::create([
            'user_id' => $user->id,
            'child_id' => $child->id,
            'facility_id' => $facility->id,
            'provider_id' => $user->id,
            'visit_date' => Carbon::now()->subDays(10),
            'visit_type' => 'prenatal',
            'notes' => 'Prenatal checkup',
        ]);

        // Create a postnatal visit
        $postnatal = PostnatalVisit::create([
            'user_id' => $user->id,
            'child_id' => $child->id,
            'facility_id' => $facility->id,
            'provider_id' => $user->id,
            'visit_date' => Carbon::now()->subDays(5),
            'visit_type' => 'postnatal',
            'notes' => 'Postnatal follow-up',
        ]);

        // Add immunizations to each
        $prenatal->immunizations()->createMany([
            [
                'vaccine_name' => 'Tetanus',
                'dose' => '1st',
                'scheduled_on' => Carbon::now()->subDays(12),
                'administered_on' => Carbon::now()->subDays(10),
                'notes' => 'Administered successfully',
            ],
            [
                'vaccine_name' => 'Tetanus',
                'dose' => '2nd',
                'scheduled_on' => Carbon::now()->addDays(5),
                'administered_on' => null,
                'notes' => 'Scheduled soon',
            ],
        ]);

        $postnatal->immunizations()->createMany([
            [
                'vaccine_name' => 'BCG',
                'dose' => '1st',
                'scheduled_on' => Carbon::now()->subDays(7),
                'administered_on' => null,
                'notes' => 'Missed appointment',
            ],
        ]);
    }
}
