<?php

namespace App\Providers;

use App\Services\SettingsService;
use Illuminate\Foundation\Application;
use Illuminate\Support\ServiceProvider;

class SettingsServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(SettingsService::class, function (Application $app) {
            return new SettingsService($app->make('request')->user());
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
