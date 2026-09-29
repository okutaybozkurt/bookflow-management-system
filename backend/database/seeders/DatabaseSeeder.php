<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Services\DemoDataService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@bookflow.com'], [
            'name' => 'BookFlow Yönetici',
            'password' => env('ADMIN_PASSWORD', 'Admin1234'),
            'role' => UserRole::Admin,
        ]);

        User::updateOrCreate(['email' => 'musteri@bookflow.com'], [
            'name' => 'Demo Müşteri',
            'password' => 'Musteri1234',
            'role' => UserRole::Customer,
        ]);

        // Kitap kataloğu ve örnek sipariş geçmişi (raporlar dolu görünsün).
        if (config('app.demo_reset_enabled')) {
            app(DemoDataService::class)->reset('golden');
        }
    }
}
