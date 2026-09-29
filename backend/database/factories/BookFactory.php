<?php

namespace Database\Factories;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Book> */
class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        return [
            'title' => fake()->unique()->sentence(3),
            'isbn' => fake()->unique()->isbn13(),
            'price' => fake()->randomFloat(2, 30, 300),
            'stock' => fake()->numberBetween(5, 50),
            'description' => fake()->paragraph(),
            'page_count' => fake()->numberBetween(100, 600),
            'published_year' => fake()->numberBetween(1990, 2025),
            'language' => 'Türkçe',
            'is_active' => true,
            'author_id' => Author::factory(),
            'category_id' => Category::factory(),
        ];
    }
}
