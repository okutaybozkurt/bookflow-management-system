<?php

use App\Http\Middleware\EnsureUserIsAdmin;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
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

        // Laravel, yetki hatasını (AuthorizationException) render'dan önce AccessDeniedHttpException'a çevirir.
        $exceptions->render(fn (AuthorizationException|AccessDeniedHttpException $e, Request $r) => response()->json(
            ['message' => 'Bu işlem için yetkiniz yok.'], 403));

        $exceptions->render(fn (ModelNotFoundException|NotFoundHttpException $e, Request $r) => response()->json(
            ['message' => 'Kayıt bulunamadı.'], 404));

        // Diğer HTTP hataları (405 yanlış metot, 429 çok fazla istek...): Türkçe ve tek biçimli.
        $exceptions->render(function (HttpExceptionInterface $e, Request $r) {
            $known = [
                405 => 'Bu adres için bu HTTP metodu desteklenmiyor.',
                429 => 'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.',
                413 => 'Gönderilen veri çok büyük.',
            ];

            return response()->json(
                ['message' => $known[$e->getStatusCode()] ?? ($e->getMessage() ?: 'İstek işlenemedi.')],
                $e->getStatusCode(),
                $e->getHeaders(),
            );
        });

        // Beklenmeyen sunucu hataları: ayrıntı (dosya yolu, izleme) istemciye ASLA verilmez.
        // Hata yine de loglanır (storage/logs/laravel.log); APP_DEBUG açık olsa bile API bunu sızdırmaz.
        $exceptions->render(function (Throwable $e, Request $r) {
            if ($e instanceof ValidationException || $e instanceof HttpResponseException || ! $r->is('api/*')) {
                return null; // varsayılan (422 vb.) davranış
            }

            return response()->json(['message' => 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'], 500);
        });
    })->create();
