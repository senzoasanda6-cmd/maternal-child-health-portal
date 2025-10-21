<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Facility;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Facility::insert([
            ['name' => 'Radiology', 'description' => 'X-ray and imaging services'],
            ['name' => 'Pediatrics', 'description' => 'Child healthcare services'],
            ['name' => 'Emergency', 'description' => '24/7 emergency care'],
        ]);
    }
}
