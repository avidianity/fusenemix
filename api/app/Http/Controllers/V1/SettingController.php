<?php

namespace App\Http\Controllers\V1;

use App\Enums\Setting\Type;
use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Setting\StoreRequest;
use App\Http\Resources\SettingResource;
use App\Models\Setting;
use App\Models\User;
use App\Services\Validation\RulesService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    public function __construct(protected RulesService $rulesService)
    {
        //
    }

    public function index(Request $request)
    {
        /**
         * @var User
         */
        $user = $request->user();

        $settings = $user->settings()->get();

        return SettingResource::collection($settings);
    }

    public function show(Request $request, $type)
    {
        $type = parseEnum($type, Type::class);

        /**
         * @var User
         */
        $user = $request->user();

        $setting = $user->settings()
            ->type($type->value)
            ->firstOrFail();

        return SettingResource::make($setting);
    }

    public function store(StoreRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $type = $request->enumOrFail('type', Type::class);

            $rules = $this->rulesService->forSettingType($type);

            $data = Validator::validate(
                data: $request->validated('data'),
                rules: $rules,
            );

            if ($type === Type::FILESYSTEM) {
                $data['config'] = Validator::validate(
                    data: $data['config'],
                    rules: $this->rulesService->forFilesystemConfig($data['driver']),
                );
            }

            /**
             * @var User
             */
            $user = $request->user();

            $setting = $user->settings()
                ->firstOrCreate(['type' => $type->value], ['data' => []]);

            $setting->update(['data' => $data]);

            return SettingResource::make($setting)
                ->response()
                ->setStatusCode(Response::HTTP_OK);
        });
    }

    public function destroy(Request $request, $type)
    {
        $type = parseEnum($type, Type::class);

        /**
         * @var User
         */
        $user = $request->user();

        $setting = $user->settings()
            ->type($type->value)
            ->firstOrFail();

        $setting->delete();

        return response()->noContent();
    }
}
