<?php

namespace Database\Factories;

use App\Models\PrenatalVisit;
use App\Models\User;
use App\Models\Child;
use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class PrenatalVisitFactory extends Factory
{
    protected $model = PrenatalVisit::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'child_id' => Child::factory(),
            'facility_id' => Facility::factory(),
            'provider_id' => User::factory(),
            'visit_date' => Carbon::now()->subDays(rand(5, 20)),
            'visit_type' => 'prenatal',
            'notes' => $this->faker->sentence,
        ];
    }
}
