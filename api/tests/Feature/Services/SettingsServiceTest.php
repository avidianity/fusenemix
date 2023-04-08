<?php

use App\Enums\Setting\Type;
use App\Exceptions\MissingSettingException;
use App\Models\User;
use App\Services\SettingsService;

it('fails when getting a missing setting', function () {
    $user = User::factory()->create();

    $service = new SettingsService($user);

    $service->get(Type::random());
})->throws(MissingSettingException::class);
