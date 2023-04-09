<?php

use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\FileController;
use App\Http\Controllers\V1\InternalController;
use App\Http\Controllers\V1\SettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->as('auth.')->controller(AuthController::class)->group(function () {
    Route::post('login', 'login')->name('login');
    Route::post('register', 'register')->name('register');

    Route::middleware('auth:users')->group(function () {
        Route::get('check', 'check')->name('check');
        Route::post('logout', 'logout')->name('logout');
    });
});

Route::middleware('auth:users')->group(function () {
    Route::apiResource('settings', SettingController::class)->except(['update']);

    Route::prefix('files')->as('files.')->controller(FileController::class)->group(function () {
        Route::get('find', 'find')->name('find');
        Route::post('import', 'import')->name('import');
        Route::get('{file}/download', 'download')->name('download');
    });
    Route::apiResource('files', FileController::class)->except(['update']);
});

Route::prefix('internal')->as('internal.')->controller(InternalController::class)->group(function () {
    Route::get('enum/{type}', 'enum')->name('enum');
});
