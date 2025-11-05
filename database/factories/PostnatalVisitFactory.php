<?php

namespace Database\Factories;

use App\Models\PostnatalVisit;
use App\Models\User;
use App\Models\Child;
use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class PostnatalVisitFactory extends Factory
{
    protected $model = PostnatalVisit::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'child_id' => Child::factory(),
            'facility_id' => Facility::factory(),
            'provider_id' => User::factory(),
            'visit_date' => Carbon::now()->subDays(rand(1, 10)),
            'visit_type' => 'postnatal',
            'notes' => $this->faker->sentence,
        ];
    }
}
