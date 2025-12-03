<?php

namespace Database\Seeders;

use App\Models\Event;
use DeepCopy\f001\A;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\App;
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
            // AppointmentSeeder::class,
            EventSeeder::class,
            // MotherProfileSeeder::class,
            MotherChildAppointmentSeeder::class,
            // You can move the logic from the old run() method into a new seeder
            // and call it here, e.g., MotherAndChildSeeder::class
        ]);
    }
}
