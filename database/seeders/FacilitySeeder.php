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
            [
                'name' => 'Central Health Clinic',
                'title' => 'Primary Health Care Center',
                'district_id' => 1,
                'sub_district' => 'Central',
                'type' => 'clinic',
                'level_of_care' => 'primary',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'City Hospital',
                'title' => 'Secondary Hospital',
                'district_id' => 1,
                'sub_district' => 'Downtown',
                'type' => 'hospital',
                'level_of_care' => 'secondary',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'South Maternity Center',
                'title' => 'Maternity and Child Health',
                'district_id' => 1,
                'sub_district' => 'South',
                'type' => 'clinic',
                'level_of_care' => 'primary',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'North District Hospital',
                'title' => 'District Referral Hospital',
                'district_id' => 2,
                'sub_district' => 'North',
                'type' => 'hospital',
                'level_of_care' => 'tertiary',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
