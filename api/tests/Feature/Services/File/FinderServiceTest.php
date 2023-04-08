<?php

use App\Enums\File\Type as FileType;
use App\Models\Setting;
use App\Models\User;
use App\Services\File\FinderService;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Storage;

it('finds files', function (FileType $type, array $setting) {
    $user = User::factory()->create();

    $service = new FinderService($user);

    app()->singleton(SettingsService::class, fn () => new SettingsService($user));

    Setting::factory()->for($user)->create($setting);

    $fileName = Str::random(8) . '.mp3';

    $paths = data_get($setting, 'data.paths');

    foreach ($paths as $path) {
        $storage = Storage::build([
            'driver' => 'local',
            'root' => $path,
        ]);

        $storage->put($fileName, createFakeMusicBinary());
    }

    $files = collect($service->find($type));

    expect(!$files->isEmpty())->toBeTrue();

    $files->each(
        fn (array $file) => expect(
            file_exists(
                data_get($file, 'paths.full')
            )
        )->toBeTrue()
    );

    foreach ($paths as $path) {
        $storage = Storage::build([
            'driver' => 'local',
            'root' => $path,
        ]);

        $storage->delete($fileName);
    }
})->with('file-finder')->group('services.file.finder-service');
