<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Book;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Yönetici raporları: yalnızca gelir ve satış. İptal edilen siparişler
 * gelir/satış hesaplarına dahil edilmez.
 */
class ReportService
{
    public const LOW_STOCK_THRESHOLD = 5;

    public function summary(): array
    {
        $valid = Order::where('status', '!=', 'cancelled');

        return [
            'total_revenue' => round((float) (clone $valid)->sum('total'), 2),
            'total_orders' => (clone $valid)->count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'books_sold' => (int) OrderItem::whereHas('order', fn ($q) => $q->where('status', '!=', 'cancelled'))->sum('quantity'),
            'total_books' => Book::count(),
            'total_stock' => (int) Book::sum('stock'),
            'low_stock_count' => Book::lowStock(self::LOW_STOCK_THRESHOLD)->count(),
            'customers' => User::where('role', UserRole::Customer)->count(),
        ];
    }

    /**
     * Dönem bazlı gelir ve sipariş adedi. Boş dönemler de 0 ile listelenir
     * (grafikte kopukluk olmasın). Gruplama PHP'de yapılır → veritabanından bağımsız.
     *
     * @return Collection<int, array{period:string, revenue:float, orders:int}>
     */
    public function sales(string $period, int $count): Collection
    {
        $monthly = $period === 'monthly';
        $format = $monthly ? 'Y-m' : 'Y';
        $now = CarbonImmutable::now();
        $start = $monthly ? $now->startOfMonth()->subMonths($count - 1) : $now->startOfYear()->subYears($count - 1);

        $buckets = collect(range(0, $count - 1))->mapWithKeys(fn ($i) => [
            ($monthly ? $start->addMonths($i) : $start->addYears($i))->format($format) => ['revenue' => 0.0, 'orders' => 0],
        ]);

        Order::where('status', '!=', 'cancelled')->where('created_at', '>=', $start)
            ->get(['total', 'created_at'])
            ->each(function (Order $o) use (&$buckets, $format) {
                $key = $o->created_at->format($format);
                if ($buckets->has($key)) {
                    $b = $buckets[$key];
                    $buckets[$key] = ['revenue' => $b['revenue'] + (float) $o->total, 'orders' => $b['orders'] + 1];
                }
            });

        return $buckets->map(fn ($b, $key) => [
            'period' => $key, 'revenue' => round($b['revenue'], 2), 'orders' => $b['orders'],
        ])->values();
    }

    public function topBooks(int $limit): Collection
    {
        return OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('books', 'books.id', '=', 'order_items.book_id')
            ->where('orders.status', '!=', 'cancelled')
            ->groupBy('books.id', 'books.title')
            ->orderByDesc('quantity_sold')
            ->limit($limit)
            ->get(['books.id', 'books.title', DB::raw('SUM(order_items.quantity) as quantity_sold'), DB::raw('SUM(order_items.line_total) as revenue')])
            ->map(fn ($r) => [
                'book_id' => $r->id, 'title' => $r->title,
                'quantity_sold' => (int) $r->quantity_sold, 'revenue' => round((float) $r->revenue, 2),
            ]);
    }

    public function salesByCategory(): Collection
    {
        return OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('books', 'books.id', '=', 'order_items.book_id')
            ->join('categories', 'categories.id', '=', 'books.category_id')
            ->where('orders.status', '!=', 'cancelled')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('revenue')
            ->get(['categories.id', 'categories.name', DB::raw('SUM(order_items.quantity) as quantity_sold'), DB::raw('SUM(order_items.line_total) as revenue')])
            ->map(fn ($r) => [
                'category_id' => $r->id, 'name' => $r->name,
                'quantity_sold' => (int) $r->quantity_sold, 'revenue' => round((float) $r->revenue, 2),
            ]);
    }

    public function lowStock(): Collection
    {
        return Book::lowStock(self::LOW_STOCK_THRESHOLD)->where('is_active', true)
            ->orderBy('stock')->limit(50)->get(['id', 'title', 'stock']);
    }
}
