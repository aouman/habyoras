<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AgencyController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CollaboratorController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CouponController;

// === Public routes ===
Route::get('properties', [PropertyController::class, 'index']);
Route::get('properties/{id}', [PropertyController::class, 'show']);
Route::get('agencies', [AgencyController::class, 'index']);
Route::get('agencies/{id}', [AgencyController::class, 'show']);
Route::get('notifications', [\App\Http\Controllers\Api\NotificationController::class, 'index']);

Route::get('banners', [BannerController::class, 'index']);

Route::post('auth/agency/register', [AuthController::class, 'registerAgency']);
Route::post('auth/agency/login', [AuthController::class, 'loginAgency']);
Route::post('auth/admin/login', [AuthController::class, 'loginAdmin']);

Route::post('messages', [MessageController::class, 'store']);
Route::post('properties/{id}/report', [PropertyController::class, 'report']);

Route::post('coupons/validate', [CouponController::class, 'validateCoupon']);
Route::post('auth/collaborator/register', [CollaboratorController::class, 'register']);
Route::post('auth/collaborator/login', [CollaboratorController::class, 'login']);

// === Authenticated agency routes ===
Route::middleware('auth:sanctum')->group(function () {
    Route::get('auth/me', [AuthController::class, 'meAgency']);
    Route::post('auth/logout', [AuthController::class, 'logoutAgency']);

    Route::get('my/properties', [PropertyController::class, 'myProperties']);
    Route::post('properties', [PropertyController::class, 'store']);
    Route::put('properties/{id}', [PropertyController::class, 'update']);
    Route::delete('properties/{id}', [PropertyController::class, 'destroy']);

    Route::get('my/subscription', [SubscriptionController::class, 'mySubscription']);
    Route::get('my/messages', [MessageController::class, 'agencyMessages']);
    Route::put('messages/{id}/read', [MessageController::class, 'markRead']);
    Route::delete('messages/{id}', [MessageController::class, 'destroy']);

    Route::put('agency/profile', [AgencyController::class, 'updateProfile']);
    Route::put('auth/change-password', [AuthController::class, 'changePassword']);
    Route::get('my/stats', [PropertyController::class, 'myStats']);
    Route::post('payment/init', [PaymentController::class, 'initPayment']);
    Route::get('payment/history', [PaymentController::class, 'history']);

    Route::get('my/collaborators', [CollaboratorController::class, 'index']);
    Route::post('my/collaborators/generate-invite-code', [CollaboratorController::class, 'generateInviteCode']);
    Route::delete('my/collaborators/{id}', [CollaboratorController::class, 'destroy']);
    Route::get('auth/collaborator/me', [CollaboratorController::class, 'me']);
    Route::post('auth/collaborator/logout', [CollaboratorController::class, 'logout']);
});

// === Admin routes ===
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('auth/admin/logout', [AuthController::class, 'logoutAdmin']);
    Route::get('auth/admin/me', [AuthController::class, 'meAdmin']);

    Route::get('admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('admin/properties', [PropertyController::class, 'adminIndex']);
    Route::put('admin/properties/{id}/moderate', [PropertyController::class, 'moderate']);
    Route::delete('admin/properties/{id}', [PropertyController::class, 'destroy']);

    Route::get('admin/agencies', [AgencyController::class, 'index']);
    Route::put('admin/agencies/{id}/toggle-status', [AgencyController::class, 'toggleStatus']);
    Route::put('admin/agencies/{id}/toggle-verification', [AgencyController::class, 'toggleVerification']);

    Route::get('admin/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('admin/subscriptions', [SubscriptionController::class, 'store']);
    Route::put('admin/subscriptions/{id}', [SubscriptionController::class, 'update']);

    Route::get('admin/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'adminIndex']);
    Route::post('admin/notifications', [\App\Http\Controllers\Api\NotificationController::class, 'store']);
    Route::put('admin/notifications/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'update']);
    Route::delete('admin/notifications/{id}', [\App\Http\Controllers\Api\NotificationController::class, 'destroy']);

    Route::get('admin/banners', [BannerController::class, 'adminIndex']);
    Route::post('admin/banners', [BannerController::class, 'store']);
    Route::put('admin/banners/{id}', [BannerController::class, 'update']);
    Route::delete('admin/banners/{id}', [BannerController::class, 'destroy']);

    Route::get('admin/coupons', [CouponController::class, 'adminIndex']);
    Route::post('admin/coupons', [CouponController::class, 'store']);
    Route::put('admin/coupons/{id}', [CouponController::class, 'update']);
    Route::delete('admin/coupons/{id}', [CouponController::class, 'destroy']);
});
