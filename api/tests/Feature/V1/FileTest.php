<?php

use App\Enums\File\Type as FileType;
use App\Enums\Setting\Type as SettingType;
use App\Jobs\FileImport;
use App\Models\File;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

it('fetches files', function () {
    $user = User::factory()->create();
    actingAs($user);

    File::factory()->for($user)->create();

    $response = getJson(route('v1.files.index', [
        'type' => collect(FileType::values())->random(),
    ]));

    $response->assertOk();
})->group('v1.files');

it('fetches a file', function () {
    $user = User::factory()->create();
    actingAs($user);

    $file = File::factory()->for($user)->create();

    $response = getJson(route('v1.files.show', ['file' => $file->getKey()]));

    $response->assertOk();
})->group('v1.files');

it('destroys a file', function () {
    $user = User::factory()->create();
    actingAs($user);

    $path = str(Str::random())->append('.txt')->toString();
    $config = [
        'root' => storage_path('storage/testing'),
    ];

    $fileData = [
        'driver' => 'local',
        'path' => $path,
        'config' => $config,
    ];

    $storage = Storage::build(array_merge(['driver' => 'local'], $config));

    $storage->put($path, 'my contents');

    $file = File::factory()
        ->for($user)
        ->create($fileData);

    $response = deleteJson(route('v1.files.destroy', ['file' => $file->getKey()]));

    $response->assertNoContent();

    $storage->assertMissing($path);
})->group('v1.files');

it('finds files', function (FileType $type, array $setting) {
    $user = User::factory()->create();
    actingAs($user);

    Setting::factory()->for($user)->create($setting);

    $response = getJson(route('v1.files.find', ['type' => $type->value]));

    $response->assertOk();
})->with('file-finder')->group('v1.files');

it('imports files', function () {
    Queue::fake();
    $user = User::factory()->create();
    actingAs($user);

    $path = storage_path('testing/music');

    $fileName = Str::random(8) . '.mp3';

    $storage = Storage::build([
        'driver' => 'local',
        'root' => $path,
        'throw' => true,
    ]);

    $storage->put($fileName, createFakeMusicBinary());

    $setting = [
        'type' => SettingType::FILESYSTEM,
        'data' => [
            'driver' => 'local',
            'config' => [
                'root' => $path,
            ],
        ],
    ];

    Setting::factory()
        ->for($user)
        ->create($setting);

    $payload = [
        'path' => $path,
        'files' => [
            [
                'path' => $fileName,
                'type' => FileType::MUSIC(),
            ],
        ],
    ];

    $response = postJson(route('v1.files.import'), $payload);

    $response->assertCreated();

    Queue::assertPushed(function (FileImport $job) use ($response): bool {
        return invade($job)->item->getKey() === $response->json('data.id');
    });

    $storage->delete($fileName);
})->group('v1.files');

it('fails import files', function () {
    Queue::fake();
    $user = User::factory()->create();
    actingAs($user);

    $path = storage_path('testing/music');

    $fileName = Str::random(8) . '.mp3';

    $setting = [
        'type' => SettingType::FILESYSTEM,
        'data' => [
            'driver' => 'local',
            'config' => [
                'root' => $path,
            ],
        ],
    ];

    Setting::factory()
        ->for($user)
        ->create($setting);

    $payload = [
        'path' => $path,
        'files' => [
            [
                'path' => $fileName,
                'type' => FileType::MUSIC(),
            ],
        ],
    ];

    $response = postJson(route('v1.files.import'), $payload);

    $response->assertBadRequest();
})->group('v1.files');

it('downloads a file', function () {
    Queue::fake();
    $user = User::factory()->create();
    actingAs($user);

    $path = storage_path('testing/music');

    $fileName = Str::random(8) . '.txt';

    $content = 'sample';

    $file = $user->files()->create([
        'name' => $fileName,
        'driver' => 'local',
        'path' => $fileName,
        'config' => [
            'root' => $path,
        ],
        'size' => strlen($content),
        'type' => FileType::random(),
    ]);

    $storage = Storage::build([
        'driver' => 'local',
        'root' => $path,
    ]);

    $storage->put($fileName, $content);

    $response = getJson(route('v1.files.download', ['file' => $file->getKey()]));

    $response->assertOk();

    $storage->delete($fileName);
})->group('v1.files');
