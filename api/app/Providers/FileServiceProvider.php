<?php

namespace App\Providers;

use App\Services\File\FinderService;
use Illuminate\Foundation\Application;
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
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
