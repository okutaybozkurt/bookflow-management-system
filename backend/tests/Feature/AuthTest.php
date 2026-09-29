<?php

namespace Tests\Feature;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $o = []): array
    {
        return $o + ['name' => 'Ali Veli', 'email' => 'ali@test.com', 'password' => 'Sifre1234'];
    }

    public function test_register_creates_customer_with_hashed_password_and_token(): void
    {
        $res = $this->postJson('/api/auth/register', $this->payload(['role' => 'admin']));

        $res->assertCreated()
            ->assertJsonPath('user.role', 'customer') // role dışarıdan atanamaz
            ->assertJsonMissingPath('user.password')
            ->assertJsonStructure(['token', 'token_type']);

        $this->assertNotSame('Sifre1234', User::first()->password);
        $this->assertDatabaseHas('activity_logs', ['action' => 'registered']);
    }

    public function test_register_validation_errors_return_422_with_messages(): void
    {
        User::factory()->create(['email' => 'ali@test.com']);

        $this->postJson('/api/auth/register', $this->payload(['password' => 'kisa']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_login_success_and_token_grants_access(): void
    {
        $this->postJson('/api/auth/register', $this->payload());

        $token = $this->postJson('/api/auth/login', ['email' => 'ali@test.com', 'password' => 'Sifre1234'])
            ->assertOk()->json('token');

        $this->withToken($token)->getJson('/api/me')
            ->assertOk()->assertJsonPath('data.email', 'ali@test.com');
        $this->assertDatabaseHas('activity_logs', ['action' => 'login']);
    }

    public function test_login_with_wrong_credentials_gives_same_error_for_unknown_and_wrong_password(): void
    {
        $this->postJson('/api/auth/register', $this->payload());

        $wrong = $this->postJson('/api/auth/login', ['email' => 'ali@test.com', 'password' => 'yanlis123']);
        $unknown = $this->postJson('/api/auth/login', ['email' => 'yok@test.com', 'password' => 'yanlis123']);

        $wrong->assertStatus(401)->assertJson(['message' => 'E-posta veya şifre hatalı.']);
        $this->assertSame($wrong->json(), $unknown->json());
    }

    public function test_protected_routes_require_authentication(): void
    {
        $this->getJson('/api/me')->assertStatus(401)
            ->assertJson(['message' => 'Oturum açmanız gerekiyor.']);
    }

    public function test_logout_revokes_token(): void
    {
        $token = $this->postJson('/api/auth/register', $this->payload())->json('token');

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_deleted_user_cannot_login(): void
    {
        $this->postJson('/api/auth/register', $this->payload());
        User::first()->delete(); // soft delete

        $this->postJson('/api/auth/login', ['email' => 'ali@test.com', 'password' => 'Sifre1234'])
            ->assertStatus(401);
    }

    public function test_admin_middleware_blocks_customers_and_allows_admins(): void
    {
        Route::middleware(['auth:sanctum', 'admin'])->get('/api/_admin-check', fn () => ['ok' => true]);

        $this->getJson('/api/_admin-check')->assertStatus(401);

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->getJson('/api/_admin-check')->assertStatus(403);

        $this->actingAs(User::factory()->admin()->create(), 'sanctum')
            ->getJson('/api/_admin-check')->assertOk();
    }

    public function test_profile_update_requires_current_password_for_password_change(): void
    {
        $user = User::factory()->create(['password' => 'Eski12345']);
        $this->actingAs($user, 'sanctum');

        $this->putJson('/api/me', ['password' => 'Yeni12345'])
            ->assertStatus(422)->assertJsonValidationErrors('current_password');

        $this->putJson('/api/me', ['name' => 'Yeni Ad', 'current_password' => 'Eski12345', 'password' => 'Yeni12345'])
            ->assertOk()->assertJsonPath('data.name', 'Yeni Ad');

        $this->assertTrue(\Hash::check('Yeni12345', $user->fresh()->password));
        $this->assertSame(1, ActivityLog::where('action', 'updated')->count());
    }

    public function test_profile_email_must_stay_unique(): void
    {
        User::factory()->create(['email' => 'baska@test.com']);
        $this->actingAs(User::factory()->create(), 'sanctum');

        $this->putJson('/api/me', ['email' => 'baska@test.com'])
            ->assertStatus(422)->assertJsonValidationErrors('email');
    }
}
