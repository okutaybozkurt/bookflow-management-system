<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\UserRole;
use App\Exceptions\ConflictException;
use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;
use Carbon\CarbonImmutable;
use Database\Seeders\Data\GoldenCatalog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Sunum/demo modu: kitap kataloğunu ve sipariş geçmişini tek seferde sıfırlayıp
 * "altın" (gerçekçi) ya da "kirli" (test) veriyle yeniden yükler.
 * Kullanıcı hesapları ve activity_logs korunur.
 */
class DemoDataService
{
    public const MODES = ['golden', 'junk'];

    private const DEMO_CUSTOMERS = [
        ['Ayşe Yılmaz', 'ayse@bookflow.com'],
        ['Mehmet Demir', 'mehmet@bookflow.com'],
        ['Zeynep Kaya', 'zeynep@bookflow.com'],
        ['Can Öztürk', 'can@bookflow.com'],
        ['Elif Şahin', 'elif@bookflow.com'],
    ];

    public function __construct(private readonly ActivityLogger $logger) {}

    public function reset(string $mode): array
    {
        if (! config('app.demo_reset_enabled')) {
            throw new ConflictException('Demo sıfırlama bu ortamda kapalıdır.');
        }

        mt_srand(42); // her sıfırlamada aynı, tekrarlanabilir veri

        DB::transaction(function () use ($mode) {
            $this->clearCatalog();
            $mode === 'golden' ? $this->seedGolden() : $this->seedJunk();
        });

        $this->logger->log('demo_reset', "Veriler sıfırlandı: {$mode} modu", null, ['mode' => $mode]);

        return [
            'mode' => $mode,
            'books' => Book::count(),
            'orders' => Order::count(),
        ];
    }

    /** Doğrudan sorgu: soft delete'i atlayıp tabloları gerçekten boşaltır. */
    private function clearCatalog(): void
    {
        foreach (['order_items', 'orders', 'reviews', 'favorites', 'books', 'categories', 'authors'] as $table) {
            DB::table($table)->delete();
        }
    }

    private function seedGolden(): void
    {
        $categories = array_map(fn ($n) => Category::create(['name' => $n]), GoldenCatalog::CATEGORIES);
        $authors = array_map(fn ($n) => Author::create(['name' => $n]), GoldenCatalog::AUTHORS);

        $books = [];
        foreach (GoldenCatalog::BOOKS as [$title, $price, $stock, $target, $cover, $isbn, $a, $c]) {
            $books[] = Book::create([
                'title' => $title, 'price' => $price, 'stock' => $stock, 'isbn' => $isbn,
                'cover_image' => $cover, 'author_id' => $authors[$a]->id, 'category_id' => $categories[$c]->id,
                'description' => "{$title}, {$authors[$a]->name} imzalı, {$categories[$c]->name} kategorisinin öne çıkan kitaplarından biridir.",
                'language' => 'Türkçe', 'is_active' => true,
            ]);
        }

        $this->seedOrderHistory($books, monthlyOrders: [9, 14], months: 6);
    }

    private function seedJunk(): void
    {
        $category = Category::create(['name' => 'ASDASD_KAT_99']);
        $author = Author::create(['name' => 'adsad_yazar']);

        $books = [];
        foreach (range(0, 9) as $i) {
            $books[] = Book::create([
                'title' => "ASDASD_KITAP_{$i}999", 'isbn' => "JUNK{$i}0000",
                'price' => $i % 2 === 0 ? 99999 : 0.01, 'stock' => $i % 2 === 0 ? 9999 : 0,
                'cover_image' => 'https://placehold.co/400x600/'.($i % 2 === 0 ? 'red' : 'gray').'/white?text=X_HATA_X',
                'author_id' => $author->id, 'category_id' => $category->id, 'is_active' => true,
            ]);
        }

        $this->seedOrderHistory($books, monthlyOrders: [1, 3], months: 2);
    }

    /**
     * Rapor ve grafiklerin dolu görünmesi için geçmiş siparişler üretir.
     * Siparişler geçmiş tarihli olduğundan stoklara dokunulmaz.
     *
     * @param  Book[]  $books
     * @param  array{0:int,1:int}  $monthlyOrders  aylık min/maks sipariş
     */
    private function seedOrderHistory(array $books, array $monthlyOrders, int $months): void
    {
        $customers = $this->demoCustomers();
        $now = CarbonImmutable::now();

        for ($m = $months - 1; $m >= 0; $m--) {
            $monthStart = $now->startOfMonth()->subMonths($m);
            $lastDay = $m === 0 ? $now : $monthStart->endOfMonth();
            $count = mt_rand($monthlyOrders[0], $monthlyOrders[1]);

            for ($i = 0; $i < $count; $i++) {
                $date = $monthStart->addSeconds(mt_rand(0, max(1, $monthStart->diffInSeconds($lastDay))));
                $this->createHistoricOrder($customers[array_rand($customers)], $books, $date, $m);
            }
        }
    }

    private function createHistoricOrder(User $customer, array $books, CarbonImmutable $date, int $monthsAgo): void
    {
        $picked = (array) array_rand($books, mt_rand(1, min(3, count($books))));
        $lines = [];
        $subtotal = 0;

        foreach ($picked as $idx) {
            $book = $books[$idx];
            $qty = mt_rand(1, 3);
            $line = round($book->price * $qty, 2);
            $subtotal += $line;
            $lines[] = [$book, $qty, $line];
        }

        $shipping = $subtotal >= OrderService::FREE_SHIPPING_THRESHOLD ? 0 : OrderService::SHIPPING_FEE;

        $order = new Order([
            'order_number' => 'BF-'.$date->format('ymd').'-'.Str::upper(Str::random(5)),
            'user_id' => $customer->id,
            'status' => $this->historicStatus($monthsAgo),
            'subtotal' => $subtotal,
            'shipping_fee' => $shipping,
            'total' => round($subtotal + $shipping, 2),
            'shipping_address' => 'Atatürk Mah. Cumhuriyet Cad. No: '.mt_rand(1, 99).', İstanbul',
        ]);
        $order->created_at = $date;
        $order->updated_at = $date;
        $order->save();

        foreach ($lines as [$book, $qty, $line]) {
            $order->items()->create([
                'book_id' => $book->id, 'quantity' => $qty, 'unit_price' => $book->price, 'line_total' => $line,
            ]);
        }
    }

    /** Eski siparişler teslim edilmiş, yenileri sürece bağlı; az sayıda iptal olur. */
    private function historicStatus(int $monthsAgo): OrderStatus
    {
        $roll = mt_rand(1, 100);

        if ($roll <= 6) {
            return OrderStatus::Cancelled;
        }
        if ($monthsAgo >= 1) {
            return OrderStatus::Delivered;
        }

        return $roll <= 40 ? OrderStatus::Pending : ($roll <= 70 ? OrderStatus::Shipped : OrderStatus::Delivered);
    }

    /** @return User[] */
    private function demoCustomers(): array
    {
        $users = [User::where('email', 'musteri@bookflow.com')->first()];

        foreach (self::DEMO_CUSTOMERS as [$name, $email]) {
            $users[] = User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => 'Musteri1234', 'role' => UserRole::Customer],
            );
        }

        return array_values(array_filter($users));
    }
}
