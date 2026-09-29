<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Models\ActivityLog;
use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SchemaTest extends TestCase
{
    use RefreshDatabase;

    private function makeBook(array $overrides = []): Book
    {
        $author = Author::firstOrCreate(['name' => 'Sabahattin Ali']);
        $category = Category::firstOrCreate(['name' => 'Roman']);

        return Book::create($overrides + [
            'title' => 'Kürk Mantolu Madonna',
            'isbn' => '9789753638029',
            'price' => 89.90,
            'stock' => 10,
            'author_id' => $author->id,
            'category_id' => $category->id,
        ]);
    }

    public function test_category_slug_is_generated_automatically(): void
    {
        $this->assertSame('bilim-kurgu', Category::create(['name' => 'Bilim Kurgu'])->slug);
    }

    public function test_user_role_is_cast_to_enum(): void
    {
        $user = User::factory()->admin()->create();

        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertTrue($user->isAdmin());
        $this->assertNotSame('password', $user->password); // hash'lenmiş
    }

    public function test_book_soft_delete_keeps_order_history(): void
    {
        $book = $this->makeBook();
        $user = User::factory()->create();
        $order = Order::create([
            'order_number' => 'BF-0001', 'user_id' => $user->id,
            'subtotal' => 89.90, 'shipping_fee' => 29.90, 'total' => 119.80,
            'shipping_address' => 'İstanbul',
        ]);
        $order->items()->create([
            'book_id' => $book->id, 'quantity' => 1,
            'unit_price' => 89.90, 'line_total' => 89.90,
        ]);

        $book->delete();

        $this->assertSoftDeleted($book);
        $this->assertNull(Book::find($book->id));
        $this->assertSame('Kürk Mantolu Madonna', $order->items()->first()->book->title);
        $this->assertSame(OrderStatus::Pending, $order->fresh()->status);
    }

    public function test_isbn_must_be_unique(): void
    {
        $this->makeBook();
        $this->expectException(QueryException::class);
        $this->makeBook(['title' => 'Kopya']);
    }

    public function test_author_with_books_cannot_be_deleted(): void
    {
        $book = $this->makeBook();
        $this->expectException(QueryException::class);
        $book->author->delete();
    }

    public function test_favorites_and_activity_log_relations(): void
    {
        $user = User::factory()->create();
        $book = $this->makeBook();
        $user->favoriteBooks()->attach($book->id);

        ActivityLog::create([
            'user_id' => $user->id, 'action' => 'created',
            'subject_type' => 'Book', 'subject_id' => $book->id,
            'description' => 'Kitap eklendi', 'properties' => ['title' => $book->title],
        ]);

        $this->assertCount(1, $user->favoriteBooks);
        $log = ActivityLog::where('description', 'Kitap eklendi')->first();
        $this->assertSame(['title' => $book->title], $log->properties);
        $this->assertSame($user->id, $log->user->id);
    }

    public function test_order_status_transitions(): void
    {
        $this->assertTrue(OrderStatus::Pending->canTransitionTo(OrderStatus::Shipped));
        $this->assertFalse(OrderStatus::Delivered->canTransitionTo(OrderStatus::Pending));
        $this->assertTrue(OrderStatus::Cancelled->isFinal());
    }
}
