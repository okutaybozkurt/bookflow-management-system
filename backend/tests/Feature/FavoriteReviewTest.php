<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FavoriteReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_favorites_add_list_remove(): void
    {
        $book = Book::factory()->create();
        $this->postJson("/api/favorites/{$book->id}")->assertStatus(401);

        $this->actingAs(User::factory()->create(), 'sanctum');
        $this->postJson("/api/favorites/{$book->id}")->assertCreated();
        $this->postJson("/api/favorites/{$book->id}")->assertOk(); // tekrar ekleme hata değil
        $this->getJson('/api/favorites')->assertOk()->assertJsonCount(1, 'data');

        $this->deleteJson("/api/favorites/{$book->id}")->assertNoContent();
        $this->getJson('/api/favorites')->assertJsonCount(0, 'data');
        $this->postJson('/api/favorites/9999')->assertStatus(404);
    }

    public function test_review_lifecycle_and_rating_average(): void
    {
        $book = Book::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum');
        $id = $this->postJson("/api/books/{$book->id}/reviews", ['rating' => 5, 'comment' => 'Harika'])
            ->assertCreated()->assertJsonPath('data.user.name', $user->name)->json('data.id');

        $this->postJson("/api/books/{$book->id}/reviews", ['rating' => 4])->assertStatus(409);

        $other = Book::factory()->create();
        $this->postJson("/api/books/{$other->id}/reviews", ['rating' => 9])
            ->assertStatus(422)->assertJsonValidationErrors('rating');

        $this->putJson("/api/reviews/{$id}", ['rating' => 3])->assertOk()->assertJsonPath('data.rating', 3);
        $this->getJson("/api/books/{$book->id}/reviews")->assertOk()->assertJsonCount(1, 'data');
        $this->getJson("/api/books/{$book->id}")->assertJsonPath('data.average_rating', 3)->assertJsonPath('data.reviews_count', 1);

        $this->deleteJson("/api/reviews/{$id}")->assertNoContent();
    }

    public function test_review_permissions(): void
    {
        $review = Review::create(['user_id' => User::factory()->create()->id, 'book_id' => Book::factory()->create()->id, 'rating' => 2]);

        $this->actingAs(User::factory()->create(), 'sanctum');
        $this->putJson("/api/reviews/{$review->id}", ['rating' => 5])->assertStatus(403);
        $this->deleteJson("/api/reviews/{$review->id}")->assertStatus(403);

        $this->actingAs(User::factory()->admin()->create(), 'sanctum');
        $this->deleteJson("/api/reviews/{$review->id}")->assertNoContent(); // admin uygunsuz yorumu silebilir
    }
}
