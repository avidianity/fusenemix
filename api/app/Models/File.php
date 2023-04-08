<?php

namespace App\Models;

use App\Casts\Json;
use App\Enums\File\Type;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    use HasFactory;
    use HasUlids;

    protected $fillable = [
        'user_id',
        'name',
        'size',
        'type',
        'path',
        'driver',
        'config',
        'meta',
    ];

    protected $casts = [
        'type' => Type::class,
        'config' => Json::class,
        'meta' => Json::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
