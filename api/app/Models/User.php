<?php

namespace App\Models;

use App\Casts\Password;
use App\Http\Resources\UserResource;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject, AuthenticatableContract
{
    use HasFactory;
    use HasUlids;
    use Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
    ];

    protected $casts = [
        'password' => Password::class,
    ];

    public function getJWTIdentifier(): string
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'data' => UserResource::make($this)->jsonSerialize(),
        ];
    }

    public function settings(): HasMany
    {
        return $this->hasMany(Setting::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function jobs(): HasMany
    {
        return $this->hasMany(Job::class);
    }
}
