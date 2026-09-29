<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Book */
class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'isbn' => $this->isbn,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'cover_image' => $this->coverUrl(),
            'description' => $this->description,
            'page_count' => $this->page_count,
            'published_year' => $this->published_year,
            'language' => $this->language,
            'is_active' => $this->is_active,
            'author' => new AuthorResource($this->whenLoaded('author')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'sold' => $this->whenHas('sold_count', fn () => (int) $this->sold_count),
            'average_rating' => $this->whenHas('average_rating', fn () => $this->average_rating ? round((float) $this->average_rating, 1) : null),
            'reviews_count' => $this->whenHas('reviews_count'),
            'deleted_at' => $this->deleted_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }

    private function coverUrl(): ?string
    {
        $cover = $this->cover_image;

        if (! $cover || str_starts_with($cover, 'http')) {
            return $cover;
        }

        return Storage::disk('public')->url($cover);
    }
}
