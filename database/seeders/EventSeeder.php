<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Clear the table to prevent duplicates on re-seed
        DB::table('events')->truncate();

        // Dynamically fetch the facility ID for Tlamelong Clinic
        $facility = DB::table('facilities')->where('name', 'Tlamelong Clinic')->first();

        if (!$facility) {
            // Optionally, create the facility if it does not exist
            $facilityId = DB::table('facilities')->insertGetId([
                'name' => 'Tlamelong Clinic',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $facilityId = $facility->id;
        }

        DB::table('events')->insert([
            [
                'title' => 'Prenatal Yoga Class',
                'start' => Carbon::now()->startOfWeek()->addDay()->addHours(9),
                'end' => Carbon::now()->startOfWeek()->addDay()->addHours(10),
                'care_type' => 'prenatal',
                'facility_id' => $facilityId,
                'facility_name' => 'Tlamelong Clinic',
                'status' => 'confirmed',
                'recurrence' => 'weekly',
                'recurrence_days' => json_encode([1]), // Monday
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Dr. Smith Consultation',
                'start' => Carbon::now()->startOfWeek()->addDays(2)->addHours(14),
                'end' => Carbon::now()->startOfWeek()->addDays(2)->addHours(14)->addMinutes(30),
                'care_type' => 'prenatal',
                'facility_id' => $facilityId,
                'facility_name' => 'Tlamelong Clinic',
                'status' => 'confirmed',
                'recurrence' => 'none',
                'recurrence_days' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Postnatal Checkup',
                'start' => Carbon::now()->addWeek()->startOfWeek()->addDays(4)->addHours(11),
                'end' => Carbon::now()->addWeek()->startOfWeek()->addDays(4)->addHours(12),
                'care_type' => 'postnatal',
                'facility_id' => $facilityId,
                'facility_name' => 'Tlamelong Clinic',
                'status' => 'pending',
                'recurrence' => 'none',
                'recurrence_days' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
