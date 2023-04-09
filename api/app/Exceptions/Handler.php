<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (PostTooLargeException $e) {
            return response()->json(makeErrorArray(
                type: 'POST_TOO_LARGE',
                message: $e->getMessage(),
                code: $e->getCode(),
            ), $e->getStatusCode());
        });

        $this->renderable(function (ModelNotFoundException $e) {
            return response()->json(
                makeErrorArray(
                    type: 'RESOURCE_MISSING',
                    message: $e->getMessage(),
                    meta: [
                        'type' => $e->getModel(),
                        'id' => $e->getIds(),
                    ],
                    code: $e->getCode(),
                ),
                Response::HTTP_NOT_FOUND
            );
        });

        $this->renderable(function (AuthenticationException $e) {
            return response()->json(
                makeErrorArray(
                    type: 'AUTHENTICATION_ERROR',
                    message: $e->getMessage(),
                    code: $e->getCode(),
                ),
                Response::HTTP_UNAUTHORIZED
            );
        });

        $this->renderable(function (ValidationException $e) {
            $statusCode = $e->status;
            $code = $e->getCode();
            $fields = collect($e->errors())->map(function ($messages, $key) {
                return [
                    'key' => $key,
                    'errors' => $messages,
                ];
            })->values();

            return response()->json(
                makeErrorArray(
                    type: 'VALIDATION_ERROR',
                    message: $e->getMessage(),
                    meta: [
                        'fields' => $fields,
                    ],
                    code: $code,
                ),
                $statusCode,
            );
        });

        $this->renderable(function (NotFoundHttpException $e) {
            return response()->json(
                makeErrorArray(
                    type: 'NOT_FOUND',
                    message: $e->getMessage(),
                    code: $e->getCode(),
                ),
                $e->getStatusCode(),
            );
        });

        $this->renderable(function (JWTException $e) {
            return response()->json(
                makeErrorArray(
                    type: 'TOKEN_EXCEPTION',
                    message: $e->getMessage(),
                    code: $e->getCode(),
                ),
                Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        });

        $this->renderable(function (Throwable $e) {
            try {
                $code = $e->getCode();

                $type = str(get_class($e))
                    ->replace('\\', '_')
                    ->split('/_/')
                    ->last();

                $data = makeErrorArray(
                    type: str($type)
                        ->snake()
                        ->upper()
                        ->replace('_EXCEPTION', '')
                        ->toString(),
                    code: $code,
                    message: $e->getMessage(),
                );

                if (!app()->isProduction()) {
                    $data['exception'] = $e;
                }

                if (property_exists($e, 'status') && gettype($e->status) === 'integer') {
                    $code = $e->status;
                }

                $fallbackStatusCode = isValidStatusCode($code) ? $code : 500;

                return response()->json($data, callMethod($e, 'getStatusCode', $fallbackStatusCode));
            } catch (Throwable $e) {
                return $e;
            }
        });
    }
}
