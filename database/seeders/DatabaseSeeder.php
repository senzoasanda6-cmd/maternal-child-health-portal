<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            MotherUserSeeder::class,
            AuditLogSeeder::class,
            // You can move the logic from the old run() method into a new seeder
            // and call it here, e.g., MotherAndChildSeeder::class
        ]);
    }
}
