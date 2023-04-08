<?php

use App\Exceptions\InvalidEnumException;
use Illuminate\Http\Response;

if (!function_exists('callMethod')) {
    function callMethod(object $object, string $method, $default = null, array $args = []): mixed
    {
        if (!method_exists($object, $method)) {
            return $default;
        }

        return $object->{$method}(...$args);
    }
}

if (!function_exists('isValidStatusCode')) {
    function isValidStatusCode(int|string $code): bool
    {
        if (!is_int($code)) {
            return false;
        }

        return array_key_exists($code, Response::$statusTexts);
    }
}

if (!function_exists('makeErrorArray')) {
    function makeErrorArray(string $type, string $message, array $meta = [], int|string $code = 0)
    {
        $data = [
            'type' => $type,
            'message' => $message,
            'code' => $code,
        ];

        if (count(array_keys($meta)) > 0) {
            $data['meta'] = $meta;
        }

        return [
            'error' => $data,
        ];
    }
}

if (!function_exists('parseEnum')) {
    /**
     * Parse a value into an enum.
     */
    function parseEnum(string $value, string $enumClass): mixed
    {
        $enum = $enumClass::tryFrom($value);

        if (is_null($enum)) {
            throw new InvalidEnumException("$value is not a valid $enumClass enum.");
        }

        return $enum;
    }
}

if (!function_exists('getAvailableFilesystems')) {
    /**
     * Get all available filesystems
     */
    function getAvailableFilesystems(): array
    {
        return array_keys(config('filesystems.disks'));
    }
}

if (!function_exists('calculatePercentage')) {
    /**
     * Calculate percentage between two numbers
     */
    function calculatePercentage(int $currentValue, int $minValue, int $maxValue): int
    {
        return (($currentValue - $minValue) / ($maxValue - $minValue)) * 100;
    }
}
