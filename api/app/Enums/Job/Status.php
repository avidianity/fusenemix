<?php

namespace App\Enums\Job;

use App\Traits\Enums\Random;
use ArchTech\Enums\InvokableCases;
use ArchTech\Enums\Options;
use ArchTech\Enums\Values;

enum Status: string
{
    use Values;
    use Options;
    use InvokableCases;
    use Random;

    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case FAILED = 'failed';
}
