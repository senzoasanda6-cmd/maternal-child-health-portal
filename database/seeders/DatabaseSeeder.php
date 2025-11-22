<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FacilitySeeder::class,
            AdminUserSeeder::class,
            MotherUserSeeder::class,
            AuditLogSeeder::class,
            RoleUserSeeder::class,
            VisitAndImmunizationSeeder::class,
            EventSeeder::class,
            AppointmentSeeder::class,
        ]);
    }
}
