<?php

namespace App\Services\File;

use App\Enums\File\Type;
use App\Enums\Setting\Type as SettingType;
use App\Models\User;
use App\Services\SettingsService;
use finfo;
use Illuminate\Support\Facades\Storage;

class FinderService
{
    public function __construct(protected ?User $user)
    {
        //
    }

    /**
     * Find any files of specified type in the filesystem
     *
     * @return string[]
     */
    public function find(Type $type): array
    {
        return match ($type) {
            Type::MUSIC => $this->findMusic(),
        };
    }

    /**
     * Find music files in the filesystem
     *
     * @return string[]
     */
    public function findMusic(): array
    {
        $setting = app()
            ->make(SettingsService::class)
            ->get(SettingType::MUSIC_FILE_PATHS);

        $files = collect();

        $finfoMimetype = new finfo(FILEINFO_MIME_TYPE);

        foreach ($setting['paths'] as $path) {
            $storage = Storage::build([
                'driver' => 'local',
                'root' => $path,
            ]);

            foreach ($storage->files(recursive: true) as $file) {
                $fullPathFile = $path . DIRECTORY_SEPARATOR . $file;

                $mimeType = str($finfoMimetype->file($fullPathFile));

                if ($mimeType->startsWith('audio/')) {
                    $files->push([
                        'paths' => [
                            'root' => $path,
                            'full' => $fullPathFile,
                        ],
                        'filename' => $file,
                        'mime' => $mimeType->toString(),
                    ]);
                }
            }
        }

        return $files->toArray();
    }
}
