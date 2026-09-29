<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    private const ADDRESS = 'Atatürk Cad. No:1 Kadıköy İstanbul';

    private function place(User $user, array $items, array $extra = [])
    {
        return $this->actingAs($user, 'sanctum')
            ->postJson('/api/orders', ['items' => $items, 'shipping_address' => self::ADDRESS] + $extra);
    }

    public function test_order_price_is_calculated_on_server_and_stock_is_decremented(): void
    {
        $user = User::factory()->create();
        $a = Book::factory()->create(['price' => 100, 'stock' => 10]);
        $b = Book::factory()->create(['price' => 50.5, 'stock' => 5]);

        // İstemci sahte fiyat/toplam göndermeye çalışsa bile yok sayılır.
        $res = $this->place($user, [
            ['book_id' => $a->id, 'quantity' => 2, 'price' => 1],
            ['book_id' => $b->id, 'quantity' => 1],
        ], ['total' => 1])->assertCreated();

        $res->assertJsonPath('data.subtotal', 250.5)
            ->assertJsonPath('data.shipping_fee', 29.9)
            ->assertJsonPath('data.total', 280.4)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonCount(2, 'data.items');

        $this->assertSame(8, $a->fresh()->stock);
        $this->assertSame(4, $b->fresh()->stock);
        $this->assertDatabaseHas('activity_logs', ['action' => 'order_created', 'user_id' => $user->id]);
    }

    public function test_free_shipping_over_threshold(): void
    {
        $book = Book::factory()->create(['price' => 250, 'stock' => 10]);

        $this->place(User::factory()->create(), [['book_id' => $book->id, 'quantity' => 2]])
            ->assertCreated()->assertJsonPath('data.shipping_fee', 0)->assertJsonPath('data.total', 500);
    }

    public function test_insufficient_stock_returns_409_and_changes_nothing(): void
    {
        $ok = Book::factory()->create(['stock' => 5]);
        $low = Book::factory()->create(['title' => 'Az Kalan', 'stock' => 1]);

        $this->place(User::factory()->create(), [
            ['book_id' => $ok->id, 'quantity' => 2],
            ['book_id' => $low->id, 'quantity' => 3],
        ])->assertStatus(409)->assertJsonPath('message', '"Az Kalan" için yeterli stok yok (kalan: 1).');

        $this->assertSame(5, $ok->fresh()->stock); // transaction geri alındı
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_validation_and_auth(): void
    {
        $this->postJson('/api/orders', [])->assertStatus(401);

        $user = User::factory()->create();
        $book = Book::factory()->create();

        $this->place($user, [])->assertStatus(422)->assertJsonValidationErrors('items');
        $this->place($user, [['book_id' => $book->id, 'quantity' => 0]])->assertStatus(422);
        $this->place($user, [['book_id' => $book->id, 'quantity' => 1], ['book_id' => $book->id, 'quantity' => 1]])
            ->assertStatus(422);
        $this->actingAs($user, 'sanctum')->postJson('/api/orders', ['items' => [['book_id' => $book->id, 'quantity' => 1]]])
            ->assertStatus(422)->assertJsonValidationErrors('shipping_address');
    }

    public function test_inactive_book_cannot_be_ordered(): void
    {
        $book = Book::factory()->create(['is_active' => false]);

        $this->place(User::factory()->create(), [['book_id' => $book->id, 'quantity' => 1]])->assertStatus(409);
    }

    public function test_customer_sees_only_own_orders(): void
    {
        $mine = Order::factory()->create();
        $other = Order::factory()->create();

        $this->actingAs($mine->user, 'sanctum');
        $this->getJson('/api/orders')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $mine->id);
        $this->getJson("/api/orders/{$mine->id}")->assertOk();
        $this->getJson("/api/orders/{$other->id}")->assertStatus(403);
    }

    public function test_customer_can_cancel_pending_order_and_stock_is_restored(): void
    {
        $user = User::factory()->create();
        $book = Book::factory()->create(['stock' => 10]);
        $id = $this->place($user, [['book_id' => $book->id, 'quantity' => 3]])->json('data.id');
        $this->assertSame(7, $book->fresh()->stock);

        $this->postJson("/api/orders/{$id}/cancel")->assertOk()->assertJsonPath('data.status', 'cancelled');
        $this->assertSame(10, $book->fresh()->stock);

        $this->postJson("/api/orders/{$id}/cancel")->assertStatus(409); // tekrar iptal edilemez
    }

    public function test_customer_cannot_cancel_others_or_shipped_orders(): void
    {
        $shipped = Order::factory()->create(['status' => 'shipped']);

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson("/api/orders/{$shipped->id}/cancel")->assertStatus(403);

        $this->actingAs($shipped->user, 'sanctum')
            ->postJson("/api/orders/{$shipped->id}/cancel")->assertStatus(409);
    }

    public function test_admin_manages_order_status_flow(): void
    {
        $order = Order::factory()->create();
        $customer = $order->user;

        $this->actingAs($customer, 'sanctum')->getJson('/api/admin/orders')->assertStatus(403);
        $this->actingAs($customer, 'sanctum')->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'shipped'])
            ->assertStatus(403);

        $this->actingAs(User::factory()->admin()->create(), 'sanctum');
        $this->getJson('/api/admin/orders?status=pending')->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.customer.email', $customer->email);

        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'delivered'])->assertStatus(409); // atlama yok
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'bilinmeyen'])->assertStatus(422);
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'shipped'])->assertOk();
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'delivered'])->assertOk();
        $this->patchJson("/api/admin/orders/{$order->id}/status", ['status' => 'cancelled'])->assertStatus(409); // final

        $this->assertDatabaseHas('activity_logs', ['action' => 'status_changed', 'subject_id' => $order->id]);
    }

    public function test_deleted_book_stays_visible_in_order_history(): void
    {
        $user = User::factory()->create();
        $book = Book::factory()->create(['title' => 'Eski Kitap']);
        $id = $this->place($user, [['book_id' => $book->id, 'quantity' => 1]])->json('data.id');

        $book->delete();

        $this->getJson("/api/orders/{$id}")->assertOk()->assertJsonPath('data.items.0.title', 'Eski Kitap');
    }
}
