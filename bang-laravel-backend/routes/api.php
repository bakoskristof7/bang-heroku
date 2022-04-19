<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PusherController;
use App\Http\Controllers\API\RoomController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Broadcast::routes(['middleware' => ['auth:sanctum']]);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [AuthController::class, 'register']);

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('isAuthenticated', [AuthController::class, 'authenticate']);

    Route::post('logout', [AuthController::class, 'logout']);

    Route::post('create-room', [RoomController::class, 'create']);

    Route::post('join-room', [RoomController::class, 'join']);

    //Route::get('pusher/auth', [PusherController::class, 'pusherAuth']);

});



