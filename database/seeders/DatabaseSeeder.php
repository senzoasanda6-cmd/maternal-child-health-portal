<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Artisan::call('facilities:import');

        $this->call([
            AdminUserSeeder::class,
            MotherUserSeeder::class,
            AuditLogSeeder::class,
            RoleUserSeeder::class,
            VisitAndImmunizationSeeder::class,
            // You can move the logic from the old run() method into a new seeder
            // and call it here, e.g., MotherAndChildSeeder::class
        ]);
    }
}
