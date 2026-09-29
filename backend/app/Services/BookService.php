<?php

namespace App\Services;

use App\Models\Book;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BookService
{
    public function create(array $data, ?UploadedFile $cover = null): Book
    {
        $book = Book::create($this->prepare($data, $cover));

        return $book->load(['author', 'category']);
    }

    public function update(Book $book, array $data, ?UploadedFile $cover = null): Book
    {
        $oldCover = $book->cover_image;
        $book->update($this->prepare($data, $cover));

        if ($cover && $oldCover && ! str_starts_with($oldCover, 'http')) {
            Storage::disk('public')->delete($oldCover);
        }

        return $book->load(['author', 'category']);
    }

    /** Yüklenen dosya varsa depoya kaydeder; `cover` alanını `cover_image` yoluna çevirir. */
    private function prepare(array $data, ?UploadedFile $cover): array
    {
        unset($data['cover']);

        if ($cover) {
            $data['cover_image'] = $cover->store('covers', 'public');
        }

        return $data;
    }
}
