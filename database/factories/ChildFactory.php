<?php

namespace Database\Factories;

use App\Models\Child;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ChildFactory extends Factory
{
    protected $model = Child::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName . ' ' . $this->faker->lastName,
            'birth_date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'gender' => $this->faker->randomElement(['male', 'female']),
            'mother_id' => \App\Models\User::factory(),
        ];
    }
}