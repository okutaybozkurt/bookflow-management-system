<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/** Tüm hata yanıtları tek biçimli, Türkçe ve ayrıntı sızdırmayan olmalı. */
class ErrorFormatTest extends TestCase
{
    use RefreshDatabase;

    private function assertCleanError($response, int $status, ?string $message = null): void
    {
        $response->assertStatus($status)->assertJsonStructure(['message']);
        $this->assertArrayNotHasKey('trace', $response->json());
        $this->assertArrayNotHasKey('exception', $response->json());
        $this->assertArrayNotHasKey('file', $response->json());
        if ($message) {
            $response->assertJson(['message' => $message]);
        }
    }

    public function test_wrong_http_method_returns_405_in_turkish_without_debug_details(): void
    {
        config(['app.debug' => true]); // debug açıkken bile sızmamalı

        $this->assertCleanError($this->deleteJson('/api/books'), 405, 'Bu adres için bu HTTP metodu desteklenmiyor.');
    }

    public function test_unknown_route_and_missing_record_return_404(): void
    {
        $this->assertCleanError($this->getJson('/api/olmayan-adres'), 404, 'Kayıt bulunamadı.');
        $this->assertCleanError($this->getJson('/api/books/99999'), 404, 'Kayıt bulunamadı.');
    }

    public function test_policy_denial_returns_403_with_turkish_message(): void
    {
        $order = Order::factory()->create();

        $this->actingAs(User::factory()->create(), 'sanctum');
        $this->assertCleanError($this->getJson("/api/orders/{$order->id}"), 403, 'Bu işlem için yetkiniz yok.');
    }

    public function test_too_many_login_attempts_return_429_in_turkish(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $this->postJson('/api/auth/login', ['email' => 'x@x.com', 'password' => 'y']);
        }

        $this->assertCleanError(
            $this->postJson('/api/auth/login', ['email' => 'x@x.com', 'password' => 'y']),
            429, 'Çok fazla deneme yaptınız. Lütfen biraz sonra tekrar deneyin.'
        );
    }

    public function test_unexpected_exception_returns_generic_500_without_leaking_details(): void
    {
        config(['app.debug' => true]);
        Route::get('/api/_boom', fn () => throw new \RuntimeException('gizli veritabanı bilgisi'));

        $response = $this->getJson('/api/_boom');

        $this->assertCleanError($response, 500, 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.');
        $this->assertStringNotContainsString('gizli', $response->getContent());
    }

    public function test_validation_errors_keep_field_level_details(): void
    {
        $this->postJson('/api/auth/register', ['email' => 'gecersiz'])
            ->assertStatus(422)->assertJsonStructure(['message', 'errors' => ['name', 'email', 'password']]);
    }

    public function test_sql_injection_attempts_are_treated_as_plain_data(): void
    {
        User::factory()->create(['email' => 'ali@test.com']);

        // Geçerli e-posta biçiminde enjeksiyon: parametre bağlama sayesinde sadece "kullanıcı yok"
        $this->postJson('/api/auth/login', ['email' => "a'--@x.com", 'password' => "' OR '1'='1"])->assertStatus(401);
        $this->getJson('/api/books?search='.urlencode("'; DROP TABLE books; --"))->assertOk();
        $this->assertDatabaseCount('users', 1);
    }
}
