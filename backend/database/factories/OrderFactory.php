<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Order> */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'order_number' => 'BF-'.strtoupper(Str::random(8)),
            'user_id' => User::factory(),
            'status' => OrderStatus::Pending,
            'subtotal' => 100,
            'shipping_fee' => 29.90,
            'total' => 129.90,
            'shipping_address' => fake()->address(),
        ];
    }
}
