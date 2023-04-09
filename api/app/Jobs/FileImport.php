<?php

namespace App\Jobs;

use App\Enums\File\Type;
use App\Enums\Job\Status;
use App\Models\Job;
use App\Models\User;
use App\Services\File\MetaService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class FileImport implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected Job $item,
        protected array $files,
        protected User $user,
        protected array $setting,
        protected string $path,
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        DB::transaction(function () {
            $this->item->update([
                'status' => Status::IN_PROGRESS,
                'progress' => 0,
                'error' => null,
            ]);

            /**
             * @var MetaService
             */
            $metaService = app(MetaService::class);

            $setting = $this->setting;
            $files = $this->files;
            $user = $this->user;
            $storage = Storage::build([
                'driver' => 'local',
                'root' => $this->path,
                'throw' => true,
            ]);

            $userStorage = Storage::build(array_merge([
                'driver' => $setting['driver'],
                'throw' => true,
            ], $setting['config']));

            $processedFiles = collect();

            $totalFiles = count($files);

            try {
                foreach ($files as $index => $file) {
                    $filePath = data_get($file, 'path');
                    $type = data_get($file, 'type');

                    $binary = $storage->get($filePath);
                    $path = "{$user->getKey()}/$filePath";

                    $userStorage->put($path, $binary);

                    $meta = match ($type) {
                        Type::MUSIC => $metaService->getMusicDetails($binary),
                        default => [],
                    };

                    $processedFile = $user->files()->create([
                        'name' => $filePath,
                        'size' => strlen($binary),
                        'type' => $type,
                        'path' => $path,
                        'driver' => $setting['driver'],
                        'config' => $setting['config'],
                        'meta' => $meta,
                    ]);

                    $processedFiles->push($processedFile);

                    $this->item->update([
                        'progress' => calculatePercentage($index + 1, 0, $totalFiles),
                    ]);
                }
            } catch (Throwable $exception) {
                $userStorage->delete($processedFiles->map->path->toArray());
                throw $exception;
            }

            $this->item->update(['status' => Status::COMPLETED]);
        });
    }

    public function failed(Throwable $exception): void
    {
        $this->item->update([
            'status' => Status::FAILED,
            'progress' => 100,
            'error' => [
                'message' => $exception->getMessage(),
                'exception' => get_class($exception),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => collect($exception->getTrace())
                    ->map(fn ($trace) => Arr::except($trace, ['args']))
                    ->all(),
            ],
        ]);
    }
}
