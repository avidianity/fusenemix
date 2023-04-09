<?php

use App\Enums\Setting\Type;
use App\Models\Setting;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

$datasets = [
    Type::MUSIC_FILE_PATHS() => [
        'paths' => [
            '/path/to/my/music/folder',
        ],
    ],
    Type::FILESYSTEM() => [
        'driver' => 'local',
        'config' => [
            'root' => '/path/to/my/filesystem',
        ],
    ],
];

it('fetches settings', function () {
    $user = User::factory()->create();

    actingAs($user);

    $response = getJson(route('v1.settings.index'));

    $response->assertOk();
})->group('v1.settings');

it('fetches a setting', function () {
    $user = User::factory()->create();

    actingAs($user);

    $setting = Setting::factory()
        ->for($user)
        ->create();

    $response = getJson(route('v1.settings.show', ['setting' => $setting->type->value]));

    $response->assertOk();
})->group('v1.settings');

it('creates a setting', function (string $type) use ($datasets) {
    actingAs(User::factory()->create());

    $data = data_get($datasets, $type);

    $response = postJson(route('v1.settings.store'), compact('type', 'data'));

    $response->assertOk();

    assertDatabaseHas(Setting::class, ['type' => $type]);
})->with(Type::options())->group('v1.settings');

it('deletes a setting', function () {
    $user = User::factory()->create();

    actingAs($user);

    $setting = Setting::factory()
        ->for($user)
        ->create();

    $response = deleteJson(route('v1.settings.show', ['setting' => $setting->type->value]));

    $response->assertNoContent();

    assertDatabaseMissing(Setting::class, ['id' => $setting->getKey()]);
})->group('v1.settings');
