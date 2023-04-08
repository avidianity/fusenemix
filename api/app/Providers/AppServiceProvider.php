<?php

namespace App\Providers;

use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        /**
         * Create fake data for the model
         */
        Factory::macro('data', function (): array {
            /** @var Factory $this */
            return $this->make()->toArray();
        });

        /**
         * Retrieve input from the request as an enum or fail if it's not valid.
         *
         * @template TEnum
         *
         * @param  string  $key
         * @param  class-string<TEnum>  $enumClass
         * @return TEnum
         */
        Request::macro('enumOrFail', function (string $type, string $enumClass): mixed {
            /** @var Request $this */
            $enum = $this->enum($type, $enumClass);

            if (is_null($enum)) {
                throw new Exception("'$type' of $enumClass is null.");
            }

            return $enum;
        });

        /**
         * Get the user making the request or fail
         *
         * @param string|null $guard
         * @return \App\Models\User
         */
        Request::macro('userOrFail', function (string $guard = null): User {
            /** @var Request $this */
            $user = $this->user($guard);

            if (!$user) {
                throw new Exception("User is missing.");
            }

            return $user;
        });
    }
}
