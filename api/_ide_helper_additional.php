<?php

// @formatter:off
// phpcs:ignoreFile

namespace Illuminate\Http {

    use App\Models\User;

    class Request
    {
        /**
         * Get the user making the request.
         */
        public function user(string $guard = null): User
        {
            /** @var Request $this */
            return $this->user($guard);
        }
    }
}
