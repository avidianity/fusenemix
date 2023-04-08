<?php

namespace App\Models;

use App\Casts\Json;
use App\Enums\Job\Status;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Job extends Model
{
    use HasFactory;
    use HasUlids;

    protected $fillable = [
        'user_id',
        'type',
        'progress',
        'status',
        'error',
    ];

    protected $casts = [
        'status' => Status::class,
        'error' => Json::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
