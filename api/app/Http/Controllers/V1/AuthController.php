<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Auth\LoginRequest;
use App\Http\Requests\V1\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use PHPOpenSourceSaver\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    protected JWTGuard $guard;

    public function __construct()
    {
        $this->guard = auth('users');
    }

    public function login(LoginRequest $request)
    {
        if ($token = $this->guard->attempt($request->validated())) {
            $user = $this->guard->userOrFail();

            return UserResource::make($user)->additional([
                'type' => 'user',
                'access' => [
                    'type' => 'bearer',
                    'token' => $token,
                    'expiry' => config('jwt.ttl'),
                ],
            ]);
        }

        return response()->json(makeErrorArray(
            type: 'INVALID_PASSWORD',
            message: 'Password is invalid.',
        ), Response::HTTP_BAD_REQUEST);
    }

    public function register(RegisterRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $user = User::create($request->validated());

            $token = $this->guard->login($user);

            return UserResource::make($user)->additional([
                'type' => 'user',
                'access' => [
                    'type' => 'bearer',
                    'token' => $token,
                    'expiry' => config('jwt.ttl'),
                ],
            ]);
        });
    }

    public function check()
    {
        $user = $this->guard->userOrFail();

        return UserResource::make($user);
    }

    public function logout()
    {
        $this->guard->logout(true);

        return response()->noContent();
    }
}
