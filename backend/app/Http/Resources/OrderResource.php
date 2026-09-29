<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Order */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status->value,
            'subtotal' => (float) $this->subtotal,
            'shipping_fee' => (float) $this->shipping_fee,
            'total' => (float) $this->total,
            'shipping_address' => $this->shipping_address,
            'created_at' => $this->created_at?->toIso8601String(),
            'customer' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($i) => [
                'book_id' => $i->book_id,
                'title' => $i->book?->title,
                'author' => $i->book?->author?->name,
                'cover_image' => $i->book ? (new BookResource($i->book))->toArray(request())['cover_image'] : null,
                'quantity' => $i->quantity,
                'unit_price' => (float) $i->unit_price,
                'line_total' => (float) $i->line_total,
            ])),
        ];
    }
}
