<?php

use App\Services\File\MetaService;

it('gets metadata for a music file', function () {
    /**
     * @var MetaService
     */
    $service = app(MetaService::class);

    $meta = $service->getMusicDetails(createFakeMusicBinary());

    expect($meta)->toBeArray();
})->group('services.file.meta-service');
