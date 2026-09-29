<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Database\Seeders\Data\CatalogData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Başlangıç kataloğu: kategoriler, yazarlar ve kitaplar.
 * Kapak görselleri projenin içindedir (database/seeders/covers); internet gerekmez.
 * Tekrar çalıştırılabilir (idempotent).
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $this->ensureStorageLink();

        $categories = array_map(fn ($name) => Category::firstOrCreate(['name' => $name]), CatalogData::CATEGORIES);
        $authors = array_map(fn ($name) => Author::firstOrCreate(['name' => $name]), CatalogData::AUTHORS);

        foreach (CatalogData::BOOKS as [$title, $price, $stock, $coverFile, $isbn, $authorIndex, $categoryIndex]) {
            $author = $authors[$authorIndex];
            $category = $categories[$categoryIndex];

            Book::updateOrCreate(['isbn' => $isbn], [
                'title' => $title,
                'price' => $price,
                'stock' => $stock,
                'cover_image' => $this->publishCover($coverFile),
                'author_id' => $author->id,
                'category_id' => $category->id,
                'description' => "{$title}, {$author->name} imzalı, {$category->name} kategorisinin öne çıkan kitaplarından biridir.",
                'language' => 'Türkçe',
                'is_active' => true,
            ]);
        }
    }

    /** Kapağı herkese açık depoya (storage/app/public/covers) kopyalar ve göreli yolunu döndürür. */
    private function publishCover(string $file): string
    {
        Storage::disk('public')->put("covers/{$file}", File::get(database_path("seeders/covers/{$file}")));

        return "covers/{$file}";
    }

    /** public/storage bağlantısı yoksa oluşturur; kapaklar tarayıcıdan bu yol üzerinden görüntülenir. */
    private function ensureStorageLink(): void
    {
        if (! file_exists(public_path('storage'))) {
            Artisan::call('storage:link');
        }
    }
}
