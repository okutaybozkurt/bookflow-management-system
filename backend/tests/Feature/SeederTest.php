<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_initial_seed_creates_accounts_and_catalog_but_no_fake_activity(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(2, User::count());
        $this->assertSame(15, Book::count());
        $this->assertSame(0, Order::count()); // siparişler yalnızca gerçek işlemlerden oluşur
        $this->assertDatabaseCount('reviews', 0);
        $this->assertDatabaseCount('activity_logs', 0); // başlangıç verisi işlem kaydı üretmez
    }

    public function test_book_covers_are_local_files_not_external_urls(): void
    {
        Storage::fake('public'); // gerçek depoyu kirletmeden

        $this->seed(DatabaseSeeder::class);

        $this->assertSame(15, Book::count());
        Book::all()->each(function (Book $book) {
            $this->assertStringStartsWith('covers/', $book->cover_image, "{$book->title} kapağı yerel dosya olmalı");
            $this->assertStringNotContainsString('http', $book->cover_image);
            Storage::disk('public')->assertExists($book->cover_image);
        });
    }

    public function test_seeding_twice_does_not_duplicate_data(): void
    {
        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);

        $this->assertSame(2, User::count());
        $this->assertSame(15, Book::count());
    }

    public function test_seeded_admin_can_log_in_and_sees_empty_reports(): void
    {
        $this->seed(DatabaseSeeder::class);

        $token = $this->postJson('/api/auth/login', ['email' => 'admin@bookflow.com', 'password' => 'Admin1234'])
            ->assertOk()->json('token');

        $this->withToken($token)->getJson('/api/admin/reports/summary')->assertOk()
            ->assertJsonPath('data.total_revenue', 0)
            ->assertJsonPath('data.total_orders', 0)
            ->assertJsonPath('data.total_books', 15);
    }
}
