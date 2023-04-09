<?php

namespace App\Traits\Enums;

use ArchTech\Enums\Values;
use BackedEnum;
use Illuminate\Support\Arr;

/**
 * @mixin Values
 * @mixin BackedEnum
 */
trait Random
{
    public static function random(): static
    {
        return static::from(Arr::random(static::values()));
    }
}
