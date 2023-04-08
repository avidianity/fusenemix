<?php

namespace App\Services;

use App\Enums\Setting\Type;
use App\Exceptions\MissingSettingException;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

class SettingsService
{
    public function __construct(protected ?User $user)
    {
        //
    }

    public function get(Type $type): array
    {
        try {
            return $this->user
                ->settings()
                ->type($type)
                ->firstOrFail()
                ->data;
        } catch (ModelNotFoundException $exception) {
            throw new MissingSettingException(
                "{$type->value} setting is missing.",
                400
            );
        }
    }
}
