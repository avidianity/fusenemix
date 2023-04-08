<?php

namespace App\Http\Controllers\V1;

use App\Enums\File\Type;
use App\Enums\Job\Status;
use App\Enums\Setting\Type as SettingType;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\File\FindRequest;
use App\Http\Requests\V1\File\GetRequest;
use App\Http\Requests\V1\File\ImportRequest;
use App\Http\Resources\FileResource;
use App\Http\Resources\JobResource;
use App\Jobs\FileImport;
use App\Services\File\FinderService;
use App\Services\SettingsService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function __construct(
        protected FinderService $finderService,
        protected SettingsService $settingsService
    ) {
        //
    }

    public function index(GetRequest $request)
    {
        $user = $request->user();

        $builder = $user->files();

        if ($request->has('type')) {
            $builder->whereType($request->validated('type'));
        }

        return FileResource::collection($builder->get());
    }

    public function show(Request $request, string $id)
    {
        $user = $request->userOrFail();

        $file = $user->files()->findOrFail($id);

        return FileResource::make($file);
    }

    public function destroy(Request $request, string $id)
    {
        return DB::transaction(function () use ($request, $id) {
            $user = $request->userOrFail();

            $file = $user->files()->findOrFail($id);

            $file->delete();

            $storage = Storage::build(array_merge([
                'driver' => $file->driver,
                'throw' => false,
            ], $file->config));

            $storage->delete($file->path);

            return response()->noContent();
        });
    }

    public function find(FindRequest $request)
    {
        $type = $request->enumOrFail('type', Type::class);

        return response()->json([
            'data' => $this->finderService->find($type),
            'meta' => [
                'type' => $type->value,
            ],
        ]);
    }

    public function import(ImportRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $path = $request->validated('path');
            $files = $request->collect('files');
            $user = $request->userOrFail();

            $setting = $this->settingsService->get(SettingType::FILESYSTEM);

            $storage = Storage::build([
                'driver' => 'local',
                'root' => $path,
            ]);

            $files->each(function (array $file) use ($storage) {
                if (!$storage->exists($file['path'])) {
                    throw new Exception("{$file['path']} does not exist.", 400);
                }
            });

            $job = $user->jobs()->create([
                'type' => FileImport::class,
                'status' => Status::PENDING,
                'progress' => 0,
                'error' => null,
            ]);

            dispatch(new FileImport(
                item: $job,
                files: $files->toArray(),
                user: $user,
                setting: $setting,
                path: $path
            ));

            return JobResource::make($job);
        });
    }

    public function download(Request $request, string $id)
    {
        $user = $request->userOrFail();

        $file = $user->files()->findOrFail($id);

        $storage = Storage::build(array_merge([
            'driver' => $file->driver,
            'throw' => true,
        ], $file->config));

        return $storage->download($file->path);
    }
}
