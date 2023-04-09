<?php

use App\Enums\File\Type as FileType;
use App\Enums\Setting\Type as SettingType;
use function Pest\Laravel\getJson;

it('fetches enums', function (array $payload) {
    $type = data_get($payload, 'type');

    $config = compact('type');

    $response = getJson(route('v1.internal.enum', $config));

    $response->assertOk();

    $response->assertJson([
        'data' => data_get($payload, 'options'),
        'meta' => $config,
    ]);
})->with([
    'file.type' => fn () => [
        'type' => 'file.type',
        'options' => FileType::options(),
    ],
    'setting.type' => fn () => [
        'type' => 'setting.type',
        'options' => SettingType::options(),
    ],
]);
