<?php

namespace Database\Factories;

use App\Enums\Job\Status;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->text(10),
            'progress' => 0,
            'status' => Status::random(),
            'error' => null,
        ];
    }
}
