<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// --- Herkese açık ---
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:10,1');
});

Route::get('books', [BookController::class, 'index']);
Route::get('books/{book}', [BookController::class, 'show']);
Route::get('books/{book}/reviews', [ReviewController::class, 'index']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('authors', [AuthorController::class, 'index']);

// --- Giriş yapmış kullanıcı ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me', [AuthController::class, 'updateProfile']);

    Route::get('favorites', [FavoriteController::class, 'index']);
    Route::post('favorites/{book}', [FavoriteController::class, 'store']);
    Route::delete('favorites/{book}', [FavoriteController::class, 'destroy']);

    Route::post('books/{book}/reviews', [ReviewController::class, 'store']);
    Route::put('reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

    Route::get('orders', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
});

// --- Yönetici ---
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('books', [BookController::class, 'adminIndex']);
    Route::get('books/{id}', [BookController::class, 'adminShow'])->whereNumber('id');
    Route::post('books', [BookController::class, 'store']);
    // Dosya yüklemeli güncelleme için form-data'da `_method=PUT` ile POST da kabul edilir.
    Route::match(['put', 'patch', 'post'], 'books/{book}', [BookController::class, 'update']);
    Route::delete('books/{book}', [BookController::class, 'destroy']);
    Route::post('books/{book}/restore', [BookController::class, 'restore'])->withTrashed();

    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{order}', [AdminOrderController::class, 'show']);
    Route::patch('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);

    Route::apiResource('categories', CategoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('authors', AuthorController::class)->only(['store', 'update', 'destroy']);

    Route::apiResource('users', UserController::class);
    Route::post('users/{user}/restore', [UserController::class, 'restore'])->withTrashed();

    Route::prefix('reports')->group(function () {
        Route::get('summary', [ReportController::class, 'summary']);
        Route::get('sales', [ReportController::class, 'sales']);
        Route::get('top-books', [ReportController::class, 'topBooks']);
        Route::get('categories', [ReportController::class, 'categories']);
        Route::get('low-stock', [ReportController::class, 'lowStock']);
    });

    Route::get('activity-logs', [ActivityLogController::class, 'index']);
});
