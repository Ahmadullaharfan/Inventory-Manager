<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\NotificationPreferenceController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SocialLinkController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TwoFaRecoveryCodeController;
use App\Http\Controllers\UserAddressController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDeviceController;
use App\Http\Middleware\EnsureActiveUser;
use Illuminate\Support\Facades\Route;

Route::apiResource('products', ProductController::class);
Route::apiResource('productCategories', ProductCategoryController::class);
Route::apiResource('suppliers', SupplierController::class);
Route::apiResource('customers', CustomerController::class);

Route::middleware(['auth:sanctum', EnsureActiveUser::class])->group(function (): void {
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::get('user', [AuthController::class, 'me']);
    Route::delete('users/{user}/account', [UserController::class, 'destroyAccount'])->middleware('throttle:6,1');
    Route::apiResource('users', UserController::class);
    Route::scopeBindings()->group(function (): void {
        Route::apiResource('users.addresses', UserAddressController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('users.socialLinks', SocialLinkController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('users/{user}/notification-preferences', [NotificationPreferenceController::class, 'show']);
        Route::put('users/{user}/notification-preferences', [NotificationPreferenceController::class, 'update']);
        Route::get('users/{user}/devices', [UserDeviceController::class, 'index']);
        Route::delete('users/{user}/devices', [UserDeviceController::class, 'revokeAll']);
        Route::delete('users/{user}/devices/{device}', [UserDeviceController::class, 'destroy']);
        Route::get('users/{user}/audit-logs', [AuditLogController::class, 'index']);
        Route::middleware('throttle:6,1')->group(function (): void {
            Route::post('users/{user}/two-factor/setup', [TwoFaRecoveryCodeController::class, 'setup']);
            Route::post('users/{user}/two-factor/confirm', [TwoFaRecoveryCodeController::class, 'confirm']);
            Route::post('users/{user}/two-factor/recovery-codes', [TwoFaRecoveryCodeController::class, 'regenerate']);
            Route::delete('users/{user}/two-factor', [TwoFaRecoveryCodeController::class, 'destroy']);
        });
    });
});
