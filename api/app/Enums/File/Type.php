<?php

namespace App\Enums\File;

use ArchTech\Enums\InvokableCases;
use ArchTech\Enums\Options;
use ArchTech\Enums\Values;

enum Type: string
{
    use Values;
    use Options;
    use InvokableCases;

    case MUSIC = 'music';
}
