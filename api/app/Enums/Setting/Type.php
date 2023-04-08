<?php

namespace App\Enums\Setting;

use App\Traits\Enums\Random;
use ArchTech\Enums\InvokableCases;
use ArchTech\Enums\Options;
use ArchTech\Enums\Values;

enum Type: string
{
    use Values;
    use Options;
    use InvokableCases;
    use Random;

    case MUSIC_FILE_PATHS = 'music-file-paths';
    case FILESYSTEM = 'filesystem';
}
