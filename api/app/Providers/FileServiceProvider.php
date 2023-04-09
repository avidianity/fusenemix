<?php

namespace App\Providers;

use App\Services\File\FinderService;
use App\Services\File\MetaService;
use FFMpeg\FFMpeg;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class FileServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(FinderService::class, function (Application $app) {
            return new FinderService($app->make('request')->user());
        });

        $this->app->singleton(MetaService::class, function () {
            return new MetaService(FFMpeg::create(
                logger: Log::driver('ffmpeg'),
            ));
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
