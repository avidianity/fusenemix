<?php

namespace App\Services\Validation;

use App\Enums\Setting\Type as SettingType;
use App\Exceptions\Validation\RulesServiceException;
use Exception;
use Illuminate\Validation\Rule;

class RulesService
{
    public function forSettingType(SettingType $type): array
    {
        return match ($type) {
            SettingType::MUSIC_FILE_PATHS => [
                'paths' => ['required', 'array', 'min:1'],
                'paths.*' => ['required', 'string', 'max:255'],
            ],
            SettingType::FILESYSTEM => [
                'driver' => ['required', 'string', Rule::in(getAvailableFilesystems())],
                'config' => ['required', 'array'],
            ],
        };
    }

    public function forFilesystemConfig(string $driver): array
    {
        if (!in_array($driver, getAvailableFilesystems())) {
            throw new RulesServiceException("$driver is not a valid filesystem driver.", 500);
        }

        return match ($driver) {
            'local' => [
                'root' => ['required', 'string', 'max:255']
            ],
            's3' => [
                'key' => ['required', 'string', 'max:255'],
                'secret' => ['required', 'string', 'max:255'],
                'region' => ['required', 'string', 'max:255'],
                'bucket' => ['required', 'string', 'max:255'],
                'url' => ['nullable', 'url', 'max:255'],
                'endpoint' => ['nullable', 'url', 'max:255'],
                'use_path_style_endpoint' => ['required', 'boolean'],
            ],
        };
    }
}
