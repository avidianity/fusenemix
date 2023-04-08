<?php

namespace Database\Factories;

use App\Enums\File\Type;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\File>
 */
class FileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomAscii(),
            'size' => $this->faker->numberBetween(0, 500),
            'type' => $this->faker->randomElement(Type::values()),
            'path' => $this->faker->filePath(),
            'driver' => $this->faker->randomElement(getAvailableFilesystems()),
            'config' => [],
            'meta' => [],
        ];
    }
}
