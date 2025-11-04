<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TestUserSeeder extends Seeder
{
    public function run()
    {
        // Avoid duplicate if run multiple times
        if (User::where('email', 'test@example.test')->exists()) {
            return;
        }

        User::create([
            'name' => 'Test',
            'email' => 'test@example.test',
            'email_verified_at' => now(),
            'password' => Hash::make('P@ssw0rd123'),
            'role' => 'admin',
            'sub_role' => null,
            'designation' => 'developer',
            'facility_id' => null,
            'is_active' => true,
        ]);
    }
}
