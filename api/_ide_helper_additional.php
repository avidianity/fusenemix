<?php
// @formatter:off
// phpcs:ignoreFile

namespace Illuminate\Http {

    use App\Models\User;

    class Request
    {
        /**
         * UGet the user making the request.
         *
         * @param string|null $guard
         * @return \App\Models\User
         */
        public function user(string $guard = null): User
        {
            /** @var Request $this */
            return $this->user($guard);
        }
    }
}
