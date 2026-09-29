<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Exceptions\ConflictException;
use App\Models\Book;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Sipariş iş kuralları. Fiyat, kargo ve stok hesabı istemciye güvenilmeden
 * burada, tek bir veritabanı transaction'ı içinde yapılır.
 */
class OrderService
{
    /** Bu tutarın (TL) üzerindeki siparişlerde kargo ücretsizdir. */
    public const FREE_SHIPPING_THRESHOLD = 500;

    public const SHIPPING_FEE = 29.90;

    public function __construct(private readonly ActivityLogger $logger) {}

    /** @param array<int, array{book_id:int, quantity:int}> $items */
    public function place(User $user, array $items, string $address): Order
    {
        return DB::transaction(function () use ($user, $items, $address) {
            $books = $this->lockBooks(collect($items)->pluck('book_id'));

            $lines = [];
            $subtotalCents = 0;

            foreach ($items as $item) {
                $book = $books->get($item['book_id']);
                $qty = (int) $item['quantity'];

                if (! $book || ! $book->is_active) {
                    throw new ConflictException('Sepetteki bir kitap artık satışta değil.');
                }
                if ($book->stock < $qty) {
                    throw new ConflictException(
                        "\"{$book->title}\" için yeterli stok yok (kalan: {$book->stock})."
                    );
                }

                $unitCents = (int) round($book->price * 100);
                $subtotalCents += $unitCents * $qty;
                $lines[] = [$book, $qty, $unitCents];
            }

            $subtotal = $subtotalCents / 100;
            $shipping = $subtotal >= self::FREE_SHIPPING_THRESHOLD ? 0 : self::SHIPPING_FEE;

            $order = Order::create([
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user->id,
                'status' => OrderStatus::Pending,
                'subtotal' => $subtotal,
                'shipping_fee' => $shipping,
                'total' => round($subtotal + $shipping, 2),
                'shipping_address' => $address,
            ]);

            foreach ($lines as [$book, $qty, $unitCents]) {
                $order->items()->create([
                    'book_id' => $book->id,
                    'quantity' => $qty,
                    'unit_price' => $unitCents / 100,
                    'line_total' => $unitCents * $qty / 100,
                ]);
                $book->decrement('stock', $qty);
            }

            $this->logger->log('order_created', "Sipariş oluşturuldu: {$order->order_number}", $order, [
                'total' => $order->total,
            ], $user->id);

            return $order->load('items.book.author');
        });
    }

    public function changeStatus(Order $order, OrderStatus $next, ?User $actor = null): Order
    {
        return DB::transaction(function () use ($order, $next, $actor) {
            $order = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            if (! $order->status->canTransitionTo($next)) {
                throw new ConflictException(
                    "Sipariş durumu \"{$order->status->value}\" iken \"{$next->value}\" durumuna geçirilemez."
                );
            }

            if ($next === OrderStatus::Cancelled) {
                $this->restoreStock($order);
            }

            $from = $order->status;
            $order->update(['status' => $next]);

            $this->logger->log('status_changed', "Sipariş durumu değişti: {$order->order_number}", $order, [
                'from' => $from->value, 'to' => $next->value,
            ], $actor?->id);

            return $order->load('items.book.author', 'user');
        });
    }

    private function lockBooks($ids)
    {
        // Kilit sırası sabit (id'ye göre) → eşzamanlı siparişlerde deadlock riski azalır.
        return Book::whereIn('id', $ids->unique()->sort()->values())
            ->orderBy('id')->lockForUpdate()->get()->keyBy('id');
    }

    private function restoreStock(Order $order): void
    {
        foreach ($order->items as $item) {
            Book::withTrashed()->whereKey($item->book_id)->increment('stock', $item->quantity);
        }
    }

    private function generateOrderNumber(): string
    {
        do {
            $number = 'BF-'.now()->format('ymd').'-'.Str::upper(Str::random(5));
        } while (Order::where('order_number', $number)->exists());

        return $number;
    }
}
