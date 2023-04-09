<?php

use App\Enums\File\Type as FileType;
use App\Enums\Job\Status;
use App\Enums\Setting\Type as SettingType;
use App\Jobs\FileImport;
use App\Models\Job;
use App\Models\User;
use App\Services\SettingsService;
use Illuminate\Support\Facades\Storage;
use League\Flysystem\UnableToReadFile;

it('imports files', function () {
    $user = User::factory()->create();

    $job = $user->jobs()->create([
        'type' => FileImport::class,
        'status' => Status::PENDING,
        'progress' => 0,
        'error' => null,
    ]);

    $settingsService = new SettingsService($user);

    $root = storage_path('testing');

    $user->settings()->create([
        'type' => SettingType::FILESYSTEM,
        'data' => [
            'driver' => 'local',
            'config' => [
                'root' => $root,
            ]
        ],
    ]);

    $fileName = 'test.mp3';

    $import = new FileImport(
        item: $job,
        files: [
            [
                'type' => FileType::MUSIC(),
                'path' => $fileName,
            ]
        ],
        user: $user,
        setting: $settingsService->get(SettingType::FILESYSTEM),
        path: storage_path()
    );

    $import->handle();

    $storage = Storage::build([
        'driver' => 'local',
        'root' => $root . "/{$user->getKey()}",
    ]);

    $storage->assertExists($fileName);

    $storage->delete($fileName);

    expect($job->fresh()->status)->toBe(Status::COMPLETED);

    Storage::build([
        'driver' => 'local',
        'root' => storage_path('testing'),
    ])->deleteDirectory($user->getKey());
})->group('jobs.file-import');

it('fails to import files with invalid config', function () {
    $user = User::factory()->create();

    $job = $user->jobs()->create([
        'type' => FileImport::class,
        'status' => Status::PENDING,
        'progress' => 0,
        'error' => null,
    ]);

    $settingsService = new SettingsService($user);

    $root = storage_path("temporary/{$user->getKey()}");

    $user->settings()->create([
        'type' => SettingType::FILESYSTEM,
        'data' => [
            'driver' => 'local',
            'config' => [
                'root' => $root,
            ]
        ],
    ]);

    $fileName = 'test.mp3';

    $import = new FileImport(
        item: $job,
        files: [
            [
                'type' => FileType::MUSIC(),
                'path' => $fileName,
            ]
        ],
        user: $user,
        setting: $settingsService->get(SettingType::FILESYSTEM),
        path: $root,
    );

    try {
        $import->handle();
    } finally {
        $cleanupStorage = Storage::build([
            'driver' => 'local',
            'root' => storage_path('temporary'),
        ]);

        $cleanupStorage->deleteDirectory($user->getKey());
    }
})->group('jobs.file-import')->throws(UnableToReadFile::class);

it('fails to process', function () {
    $job = Job::factory()
        ->forUser()
        ->create();

    $import = new FileImport(
        item: $job,
        files: [
            [
                'type' => FileType::MUSIC(),
                'path' => 'test.mp3',
            ]
        ],
        user: $job->user,
        setting: [],
        path: ''
    );

    $import->failed(new Exception);

    $updatedJob = $job->fresh();

    expect($updatedJob->status)->toBe(Status::FAILED);
    expect($updatedJob->error)->toBeArray();
})->group('jobs.file-import');
