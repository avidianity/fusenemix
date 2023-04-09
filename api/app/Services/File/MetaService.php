<?php

namespace App\Services\File;

use FFMpeg\FFMpeg;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MetaService
{
    public function __construct(protected FFMpeg $ffmpeg)
    {
        //
    }

    public function getMusicDetails(string $content): array
    {
        $path = storage_path('temporary');

        $storage = Storage::build([
            'driver' => 'local',
            'root' => $path,
        ]);

        $fileName = Str::random() . '.mp3';

        $storage->put($fileName, $content);

        $audio = $this->ffmpeg->open("$path/$fileName");

        $format = $audio->getFormat();

        $metadata = $format->all();

        $storage->delete($fileName);

        unset($metadata['filename']);

        return $metadata;
    }
}
