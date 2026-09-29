<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
    }

    public function test_admin_endpoints_reject_customers_and_guests(): void
    {
        $paths = ['users', 'reports/summary', 'reports/sales', 'activity-logs'];

        foreach ($paths as $path) {
            $this->getJson("/api/admin/{$path}")->assertStatus(401);
        }

        $this->actingAs(User::factory()->create(), 'sanctum');
        foreach ($paths as $path) {
            $this->getJson("/api/admin/{$path}")->assertStatus(403);
        }
    }

    public function test_user_crud_with_soft_delete_and_self_protection(): void
    {
        $this->actingAs($this->admin, 'sanctum');

        $id = $this->postJson('/api/admin/users', [
            'name' => 'Yeni Personel', 'email' => 'p@test.com', 'password' => 'Sifre1234', 'role' => 'admin',
        ])->assertCreated()->assertJsonPath('data.role', 'admin')->assertJsonMissingPath('data.password')->json('data.id');

        $this->postJson('/api/admin/users', ['name' => 'X', 'email' => 'p@test.com', 'password' => 'Sifre1234', 'role' => 'customer'])
            ->assertStatus(422)->assertJsonValidationErrors('email');

        $this->putJson("/api/admin/users/{$id}", ['role' => 'customer', 'name' => 'Güncel'])
            ->assertOk()->assertJsonPath('data.role', 'customer');

        $this->getJson('/api/admin/users?search=Güncel')->assertJsonCount(1, 'data');

        $this->deleteJson("/api/admin/users/{$id}")->assertNoContent();
        $this->assertSoftDeleted('users', ['id' => $id]);
        $this->getJson("/api/admin/users/{$id}")->assertStatus(404);
        $this->getJson('/api/admin/users?with_trashed=1&search=Güncel')->assertJsonCount(1, 'data');
        $this->postJson("/api/admin/users/{$id}/restore")->assertOk();

        // Kendini silme/rol değiştirme engeli
        $this->deleteJson("/api/admin/users/{$this->admin->id}")->assertStatus(409);
        $this->putJson("/api/admin/users/{$this->admin->id}", ['role' => 'customer'])->assertStatus(409);
    }

    public function test_deleted_user_loses_tokens(): void
    {
        $victim = User::factory()->create();
        $victim->createToken('api');
        $this->actingAs($this->admin, 'sanctum')->deleteJson("/api/admin/users/{$victim->id}")->assertNoContent();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_reports_use_real_orders_and_ignore_cancelled(): void
    {
        $cat = Category::factory()->create(['name' => 'Roman']);
        $book = Book::factory()->create(['title' => 'Çok Satan', 'category_id' => $cat->id, 'stock' => 2]);

        $paid = Order::factory()->create(['total' => 200]);
        $paid->items()->create(['book_id' => $book->id, 'quantity' => 3, 'unit_price' => 60, 'line_total' => 180]);
        $gone = Order::factory()->create(['total' => 999, 'status' => 'cancelled']);
        $gone->items()->create(['book_id' => $book->id, 'quantity' => 9, 'unit_price' => 100, 'line_total' => 900]);

        $this->actingAs($this->admin, 'sanctum');

        $this->getJson('/api/admin/reports/summary')->assertOk()
            ->assertJsonPath('data.total_revenue', 200)
            ->assertJsonPath('data.total_orders', 1)
            ->assertJsonPath('data.books_sold', 3)
            ->assertJsonPath('data.low_stock_count', 1);

        $sales = $this->getJson('/api/admin/reports/sales?period=monthly&count=3')->assertOk()->json('data');
        $this->assertCount(3, $sales);
        $this->assertSame(200.0, (float) end($sales)['revenue']); // bu ayın geliri
        $this->assertSame(0.0, (float) $sales[0]['revenue']);     // boş ay 0 ile gelir

        $this->getJson('/api/admin/reports/sales?period=yearly&count=2')->assertJsonCount(2, 'data');
        $this->getJson('/api/admin/reports/sales?period=weekly')->assertStatus(422);

        $this->getJson('/api/admin/reports/top-books')->assertJsonPath('data.0.title', 'Çok Satan')
            ->assertJsonPath('data.0.quantity_sold', 3);
        $this->getJson('/api/admin/reports/categories')->assertJsonPath('data.0.name', 'Roman')
            ->assertJsonPath('data.0.revenue', 180);
        $this->getJson('/api/admin/reports/low-stock')->assertJsonPath('data.0.title', 'Çok Satan');

        // Kitap listesindeki "sold" da iptalleri saymaz
        $this->getJson("/api/admin/books/{$book->id}")->assertJsonPath('data.sold', 3);
    }

    public function test_activity_log_listing_and_filters(): void
    {
        $this->actingAs($this->admin, 'sanctum');
        $this->postJson('/api/admin/categories', ['name' => 'Şiir']);
        $this->postJson('/api/admin/users', ['name' => 'A', 'email' => 'a@t.com', 'password' => 'Sifre1234', 'role' => 'customer']);

        $this->getJson('/api/admin/activity-logs')->assertOk()
            ->assertJsonStructure(['data' => [['action', 'description', 'user' => ['name'], 'created_at']], 'meta' => ['total']]);
        $this->getJson('/api/admin/activity-logs?subject_type=Category')->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.description', 'Kategori eklendi: Şiir');
        $this->getJson("/api/admin/activity-logs?user_id={$this->admin->id}&action=created")->assertJsonCount(2, 'data');
        $this->getJson('/api/admin/activity-logs?from=not-a-date')->assertStatus(422);
    }
}
