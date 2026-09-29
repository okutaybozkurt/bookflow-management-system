<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias(['admin' => EnsureUserIsAdmin::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Tüm hatalar tek formatta: { "message": "..." } (+ doğrulamada "errors").
        // Özel mesaj (ör. hatalı şifre) korunur; varsayılan İngilizce mesaj Türkçeleştirilir.
        $exceptions->render(fn (AuthenticationException $e, Request $r) => response()->json(
            ['message' => $e->getMessage() === 'Unauthenticated.' ? 'Oturum açmanız gerekiyor.' : $e->getMessage()], 401));

        $exceptions->render(fn (AuthorizationException $e, Request $r) => response()->json(
            ['message' => 'Bu işlem için yetkiniz yok.'], 403));

        $exceptions->render(fn (ModelNotFoundException|NotFoundHttpException $e, Request $r) => response()->json(
            ['message' => 'Kayıt bulunamadı.'], 404));
    })->create();
