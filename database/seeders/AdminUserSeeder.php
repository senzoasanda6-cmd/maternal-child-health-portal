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
            ['email' => 'Senzo.Dubazana@gauteng.gov.za'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('Travis@10'),
                'role' => 'admin',
            ]
        );
    }
}