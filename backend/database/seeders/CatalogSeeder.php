<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Database\Seeders\Data\CatalogData;
use Illuminate\Database\Seeder;

/** Başlangıç kataloğu: kategoriler, yazarlar ve kitaplar. Tekrar çalıştırılabilir (idempotent). */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = array_map(fn ($name) => Category::firstOrCreate(['name' => $name]), CatalogData::CATEGORIES);
        $authors = array_map(fn ($name) => Author::firstOrCreate(['name' => $name]), CatalogData::AUTHORS);

        foreach (CatalogData::BOOKS as [$title, $price, $stock, $cover, $isbn, $authorIndex, $categoryIndex]) {
            $author = $authors[$authorIndex];
            $category = $categories[$categoryIndex];

            Book::firstOrCreate(['isbn' => $isbn], [
                'title' => $title,
                'price' => $price,
                'stock' => $stock,
                'cover_image' => $cover,
                'author_id' => $author->id,
                'category_id' => $category->id,
                'description' => "{$title}, {$author->name} imzalı, {$category->name} kategorisinin öne çıkan kitaplarından biridir.",
                'language' => 'Türkçe',
                'is_active' => true,
            ]);
        }
    }
}
