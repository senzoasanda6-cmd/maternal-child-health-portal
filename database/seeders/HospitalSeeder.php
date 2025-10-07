<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HospitalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Import the Hospital model
        \App\Models\Hospital::create(['name' => 'Johannesburg General', 'location' => 'Johannesburg', 'contact_number' => '011-123-4567']);
        \App\Models\Hospital::create(['name' => 'Soweto Clinic', 'location' => 'Soweto', 'contact_number' => '011-987-6543']);
    }
}

