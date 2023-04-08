<?php

namespace App\Http\Controllers\V1;

use App\Enums\File\Type as FileType;
use App\Enums\Setting\Type as SettingType;
use App\Http\Controllers\Controller;

class InternalController extends Controller
{
    public function enum(string $type)
    {
        $enum = match ($type) {
            'file.type' => FileType::options(),
            'setting.type' => SettingType::options(),
        };

        return response()->json([
            'data' => $enum,
            'meta' => [
                'type' => $type,
            ]
        ]);
    }
}
