<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MotherProfile;
use App\Models\{Child, GrowthRecord, Appointment, Milestone, HealthRecord};

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // Create a user
        $user = User::create([
            'name' => 'Nomsa Dlamini',
            'email' => 'nomsa@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create a mother profile
        $profile = MotherProfile::create([
            'user_id' => $user->id,
            'name' => 'Nomsa Dlamini',
            'dob' => '1990-05-12',
            'contact' => '082 123 4567',
            'address' => '123 Main Street, Brakpan',
        ]);

        // Create a child
        $child = Child::create([
            'mother_profile_id' => $profile->id,
            'name' => 'Amina',
            'gender' => 'Female',
            'age' => 14,
            'dob' => '2024-08-01',
            'next_checkup' => '2025-11-05',
            'growth_status' => 'Normal',
        ]);

        // Seed growth records
        GrowthRecord::insert([
            ['child_id' => $child->id, 'date' => '2025-01-01', 'height' => 70, 'weight' => 8],
            ['child_id' => $child->id, 'date' => '2025-05-01', 'height' => 75, 'weight' => 9],
            ['child_id' => $child->id, 'date' => '2025-09-01', 'height' => 78, 'weight' => 9.5],
        ]);

        // Seed appointments
        Appointment::insert([
            ['child_id' => $child->id, 'date' => '2025-11-05', 'type' => 'Child Checkup', 'location' => 'Clinic A'],
            ['child_id' => $child->id, 'date' => '2025-11-12', 'type' => 'Nutrition Counseling', 'location' => 'Clinic B'],
        ]);

        // Seed milestones
        Milestone::insert([
            ['child_id' => $child->id, 'label' => 'Can sit without support', 'status' => '✅'],
            ['child_id' => $child->id, 'label' => 'Responds to name', 'status' => '✅'],
            ['child_id' => $child->id, 'label' => 'Walks independently', 'status' => '⏳'],
        ]);

        // Seed health records
        HealthRecord::insert([
            ['child_id' => $child->id, 'title' => 'Immunization: Polio', 'details' => 'Completed on 2025-08-01'],
            ['child_id' => $child->id, 'title' => 'Doctor Note', 'details' => 'Healthy growth noted at last visit.'],
        ]);
    }
}
