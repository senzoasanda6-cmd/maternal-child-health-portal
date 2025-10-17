<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class MotherUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'mother@gauteng.gov.za'],
            [
                'name' => 'Mother User',
                'password' => Hash::make('P@ssw0rd'),
                'role' => 'mother',
            ]
        );
    }
}
