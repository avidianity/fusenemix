<?php

use App\Exceptions\Validation\RulesServiceException;
use App\Services\Validation\RulesService;
use Illuminate\Support\Str;

it('fails with an invalid driver', function () {
    $service = app(RulesService::class);

    $service->forFilesystemConfig(Str::random());
})->throws(RulesServiceException::class);
