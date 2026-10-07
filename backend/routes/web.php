<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\EnsureActiveUser;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api/auth')->group(function (): void {
    Route::middleware('throttle:6,1')->group(function (): void {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('register', [AuthController::class, 'register']);
    });
    Route::post('logout', [AuthController::class, 'logout'])->middleware(['auth:sanctum', EnsureActiveUser::class]);
});
