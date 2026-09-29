<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    private function payload(array $o = []): array
    {
        return $o + [
            'title' => 'Sefiller', 'isbn' => '9781111111111', 'price' => 120.5, 'stock' => 8,
            'author_id' => Author::factory()->create()->id,
            'category_id' => Category::factory()->create()->id,
        ];
    }

    public function test_public_can_list_only_active_books_with_pagination(): void
    {
        Book::factory()->count(3)->create();
        Book::factory()->create(['is_active' => false]);

        $this->getJson('/api/books?per_page=2')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonStructure(['data' => [['id', 'title', 'price', 'author' => ['name'], 'category' => ['name'], 'sold']]]);
    }

    public function test_search_and_filters(): void
    {
        $author = Author::factory()->create(['name' => 'Yaşar Kemal']);
        $cat = Category::factory()->create();
        Book::factory()->create(['title' => 'İnce Memed', 'author_id' => $author->id, 'price' => 50]);
        Book::factory()->create(['title' => 'Başka Kitap', 'category_id' => $cat->id, 'price' => 200]);

        $this->getJson('/api/books?search=Yaşar')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'İnce Memed');
        $this->getJson('/api/books?search=Başka')->assertJsonCount(1, 'data');
        $this->getJson("/api/books?category_id={$cat->id}")->assertJsonCount(1, 'data');
        $this->getJson('/api/books?min_price=100')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Başka Kitap');
        $this->getJson('/api/books?sort=price_desc')->assertJsonPath('data.0.title', 'Başka Kitap');
        $this->getJson('/api/books?sort=hatali')->assertStatus(422);
    }

    public function test_inactive_or_missing_book_returns_404(): void
    {
        $book = Book::factory()->create(['is_active' => false]);

        $this->getJson("/api/books/{$book->id}")->assertStatus(404);
        $this->getJson('/api/books/9999')->assertStatus(404)->assertJson(['message' => 'Kayıt bulunamadı.']);
    }

    public function test_only_admin_can_create_update_delete_books(): void
    {
        $this->postJson('/api/admin/books', $this->payload())->assertStatus(401);

        $this->actingAs(User::factory()->create(), 'sanctum')
            ->postJson('/api/admin/books', $this->payload())->assertStatus(403);

        $this->actingAs($this->admin(), 'sanctum');
        $id = $this->postJson('/api/admin/books', $this->payload())
            ->assertCreated()->assertJsonPath('data.title', 'Sefiller')->json('data.id');

        $this->putJson("/api/admin/books/{$id}", ['price' => 99.9, 'stock' => 3])
            ->assertOk()->assertJsonPath('data.price', 99.9)->assertJsonPath('data.title', 'Sefiller');

        $this->deleteJson("/api/admin/books/{$id}")->assertNoContent();
        $this->assertSoftDeleted('books', ['id' => $id]);
        $this->getJson("/api/books/{$id}")->assertStatus(404);

        $this->postJson("/api/admin/books/{$id}/restore")->assertOk();
        $this->getJson("/api/books/{$id}")->assertOk();
    }

    public function test_book_validation_errors(): void
    {
        $this->actingAs($this->admin(), 'sanctum');

        $this->postJson('/api/admin/books', ['price' => -5, 'stock' => 'abc'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'price', 'stock', 'author_id', 'category_id']);

        $first = $this->payload();
        $this->postJson('/api/admin/books', $first)->assertCreated();
        $this->postJson('/api/admin/books', $first)
            ->assertStatus(422)->assertJsonPath('errors.isbn.0', 'Bu ISBN numarasına sahip bir kitap zaten mevcut.');
    }

    public function test_cover_upload_is_stored_and_returned_as_url(): void
    {
        Storage::fake('public');
        $this->actingAs($this->admin(), 'sanctum');

        $res = $this->post('/api/admin/books', $this->payload([
            'cover' => UploadedFile::fake()->image('kapak.jpg'),
        ]), ['Accept' => 'application/json'])->assertCreated();

        $path = Book::first()->cover_image;
        Storage::disk('public')->assertExists($path);
        $this->assertStringContainsString($path, $res->json('data.cover_image'));
    }

    public function test_book_changes_are_logged_by_observer(): void
    {
        $admin = $this->admin();
        $this->actingAs($admin, 'sanctum');

        $id = $this->postJson('/api/admin/books', $this->payload())->json('data.id');
        $this->putJson("/api/admin/books/{$id}", ['price' => 10]);
        $this->deleteJson("/api/admin/books/{$id}");

        foreach (['created', 'updated', 'deleted'] as $action) {
            $this->assertDatabaseHas('activity_logs', [
                'action' => $action, 'subject_type' => 'Book', 'subject_id' => $id, 'user_id' => $admin->id,
            ]);
        }
    }

    public function test_category_and_author_crud_with_delete_protection(): void
    {
        $this->actingAs($this->admin(), 'sanctum');

        $catId = $this->postJson('/api/admin/categories', ['name' => 'Tarih'])
            ->assertCreated()->assertJsonPath('data.slug', 'tarih')->json('data.id');
        $this->putJson("/api/admin/categories/{$catId}", ['name' => 'Dünya Tarihi'])
            ->assertOk()->assertJsonPath('data.slug', 'dunya-tarihi');
        $this->postJson('/api/admin/categories', ['name' => 'Dünya Tarihi'])->assertStatus(422);

        $authorId = $this->postJson('/api/admin/authors', ['name' => 'Ahmet Ümit'])->assertCreated()->json('data.id');

        Book::factory()->create(['category_id' => $catId, 'author_id' => $authorId]);
        $this->deleteJson("/api/admin/categories/{$catId}")->assertStatus(409);
        $this->deleteJson("/api/admin/authors/{$authorId}")->assertStatus(409);

        $free = Category::factory()->create();
        $this->deleteJson("/api/admin/categories/{$free->id}")->assertNoContent();

        $this->getJson('/api/categories')->assertOk()->assertJsonFragment(['name' => 'Dünya Tarihi', 'books_count' => 1]);
        $this->getJson('/api/authors')->assertOk();
    }
}
