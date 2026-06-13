<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::post('webhooks/geniuspay', [\App\Http\Controllers\Api\WebhookController::class, 'handleGeniusPay']);

Route::get('/{any?}', function () {
    return file_get_contents(public_path('dist/index.html'));
})->where('any', '.*');
