<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admin_can_reset(): void
    {
        $this->postJson('/api/admin/reset', ['mode' => 'golden'])->assertStatus(401);
        $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson('/api/admin/reset', ['mode' => 'golden'])->assertStatus(403);
    }

    public function test_golden_mode_loads_catalog_and_order_history_and_keeps_users(): void
    {
        Book::factory()->count(2)->create(); // silinmesi gereken eski veri
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/reset', ['mode' => 'golden'])
            ->assertOk()->assertJsonPath('data.books', 15);

        $this->assertSame(15, Book::count());
        $this->assertGreaterThan(20, Order::count());
        $this->assertTrue(User::whereKey($admin->id)->exists());
        $this->assertDatabaseHas('activity_logs', ['action' => 'demo_reset']);

        // Raporlar gerçek sipariş verisinden dolu gelir.
        $this->getJson('/api/admin/reports/summary')->assertOk();
        $this->assertGreaterThan(0, $this->getJson('/api/admin/reports/summary')->json('data.total_revenue'));
        $this->getJson('/api/admin/reports/top-books')->assertJsonCount(10, 'data');

        // İkinci sıfırlama aynı sonucu üretir (temizleyip yeniden yükler).
        $this->postJson('/api/admin/reset', ['mode' => 'golden'])->assertOk();
        $this->assertSame(15, Book::count());
    }

    public function test_junk_mode_loads_test_data(): void
    {
        $this->actingAs(User::factory()->admin()->create(), 'sanctum')
            ->postJson('/api/admin/reset', ['mode' => 'junk'])->assertOk();

        $this->assertSame(10, Book::count());
        $this->assertTrue(Book::where('title', 'like', 'ASDASD%')->exists());
    }

    public function test_invalid_mode_and_disabled_flag(): void
    {
        $this->actingAs(User::factory()->admin()->create(), 'sanctum');

        $this->postJson('/api/admin/reset', ['mode' => 'x'])->assertStatus(422);

        config(['app.demo_reset_enabled' => false]);
        $this->postJson('/api/admin/reset', ['mode' => 'golden'])->assertStatus(409);
    }
}
