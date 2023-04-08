<?php

namespace App\Models;

use App\Casts\Json;
use App\Enums\Setting\Type;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Setting extends Model
{
    use HasFactory;
    use HasUlids;

    protected $fillable = [
        'type',
        'data',
    ];

    protected $casts = [
        'data' => Json::class,
        'type' => Type::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeType(Builder $query, Type|string $type): Builder
    {
        if (is_string($type)) {
            $type = Type::from($type);
        }

        return $query->where('type', $type->value);
    }
}
