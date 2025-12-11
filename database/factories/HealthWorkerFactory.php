<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Facility;
use Illuminate\Support\Facades\Hash;

class HealthWorkerFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $facility = Facility::inRandomOrder()->first();
        $faker = $this->faker;

        return [
            'name' => $faker->name(),
            'email' => $faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => 'health_worker',
            'sub_role' => null, // assigned in seeder
            'facility_id' => $facility->id ?? null,
            'district_id' => $facility->district_id ?? null,
            'is_active' => true,
        ];
    }
}
