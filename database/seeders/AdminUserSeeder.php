<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => 'admin@gauteng.gov.za'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('G@ut3ng'),
                'role' => 'admin',
            ]
        );
    }
}