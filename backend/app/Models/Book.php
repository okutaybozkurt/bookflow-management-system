<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title', 'isbn', 'price', 'stock', 'cover_image', 'description',
        'page_count', 'published_year', 'language', 'is_active',
        'author_id', 'category_id',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /** Liste filtreleri: arama, kategori, yazar, fiyat aralığı, stok ve sıralama. */
    public function scopeFilter(Builder $query, array $f): Builder
    {
        return $query
            ->when($f['search'] ?? null, function (Builder $q, string $term) {
                $q->where(fn (Builder $w) => $w
                    ->where('title', 'like', "%{$term}%")
                    ->orWhere('isbn', 'like', "%{$term}%")
                    ->orWhereHas('author', fn (Builder $a) => $a->where('name', 'like', "%{$term}%")));
            })
            ->when($f['category_id'] ?? null, fn (Builder $q, $id) => $q->where('category_id', $id))
            ->when($f['author_id'] ?? null, fn (Builder $q, $id) => $q->where('author_id', $id))
            ->when($f['min_price'] ?? null, fn (Builder $q, $v) => $q->where('price', '>=', $v))
            ->when($f['max_price'] ?? null, fn (Builder $q, $v) => $q->where('price', '<=', $v))
            ->when($f['in_stock'] ?? null, fn (Builder $q) => $q->where('stock', '>', 0))
            ->when(isset($f['is_active']), fn (Builder $q) => $q->where('is_active', (bool) $f['is_active']))
            ->tap(fn (Builder $q) => match ($f['sort'] ?? 'newest') {
                'price_asc' => $q->orderBy('price'),
                'price_desc' => $q->orderByDesc('price'),
                'title' => $q->orderBy('title'),
                'popular' => $q->orderByDesc('sold_count'),
                default => $q->latest('id'),
            });
    }

    /** Satış adedi ve yorum istatistikleri (iptal edilen siparişler sayılmaz). */
    public function scopeWithStats(Builder $query): Builder
    {
        return $query
            ->withSum(['orderItems as sold_count' => fn (Builder $q) => $q->whereHas(
                'order', fn (Builder $o) => $o->where('status', '!=', 'cancelled')
            )], 'quantity')
            ->withAvg('reviews as average_rating', 'rating')
            ->withCount('reviews');
    }

    public function scopeLowStock(Builder $query, int $threshold = 5): Builder
    {
        return $query->where('stock', '<=', $threshold);
    }
}
