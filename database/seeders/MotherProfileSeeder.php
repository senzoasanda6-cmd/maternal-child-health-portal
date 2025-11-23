<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\MotherProfile;
use App\Models\Facility;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class MotherProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Fetch all facilities except those with type 'management'
        $facilities = Facility::where('type', '!=', 'management')->get();

        $mothersPerFacilityMin = 2;
        $mothersPerFacilityMax = 6;
        $totalCreated = 0;

        foreach ($facilities as $facility) {
            $numMothers = rand($mothersPerFacilityMin, $mothersPerFacilityMax);

            for ($i = 0; $i < $numMothers; $i++) {
                // Create mother user
                $motherUser = User::create([
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('password123'),
                    'role' => 'mother',
                    'facility_id' => $facility->id,
                ]);

                // Create linked mother profile
                MotherProfile::create([
                    'user_id' => $motherUser->id,
                    'dob' => $faker->date('Y-m-d', '-18 years'),
                    'contact_number' => $faker->phoneNumber,
                    'address' => $faker->address,
                    'last_menstrual_date' => $faker->date('Y-m-d', '-6 months'),
                    'trimester' => $faker->randomElement(['First', 'Second', 'Third']),
                ]);

                $totalCreated++;
            }
        }

        $this->command->info("$totalCreated mother users and profiles created across " . $facilities->count() . " facilities!");
    }
}
