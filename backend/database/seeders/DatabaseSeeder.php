<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Başlangıç verisi bir kullanıcı işlemi değildir; activity_logs'a kayıt düşülmez.
        ActivityLogger::muted(function () {
            User::updateOrCreate(['email' => 'admin@bookflow.com'], [
                'name' => 'BookFlow Yönetici',
                'password' => env('ADMIN_PASSWORD', 'Admin1234'),
                'role' => UserRole::Admin,
            ]);

            User::updateOrCreate(['email' => 'musteri@bookflow.com'], [
                'name' => 'Örnek Müşteri',
                'password' => 'Musteri1234',
                'role' => UserRole::Customer,
            ]);

            $this->call(CatalogSeeder::class);
        });
    }
}
