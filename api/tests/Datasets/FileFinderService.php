<?php

use App\Enums\File\Type as FileType;
use App\Enums\Setting\Type;

dataset('file-finder', [
    'MUSIC' => [
        FileType::MUSIC,
        fn () => [
            'type' => Type::MUSIC_FILE_PATHS,
            'data' => [
                'paths' => [storage_path('testing/music')],
            ],
        ],
    ],
]);
