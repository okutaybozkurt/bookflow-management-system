<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Shipped = 'shipped';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';

    /** Sipariş durum akışı: hangi durumdan hangisine geçilebilir. */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Pending => [self::Shipped, self::Cancelled],
            self::Shipped => [self::Delivered, self::Cancelled],
            self::Delivered, self::Cancelled => [],
        };
    }

    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->allowedTransitions(), true);
    }

    /** İptal ve teslim edilmiş siparişler artık değiştirilemez. */
    public function isFinal(): bool
    {
        return $this->allowedTransitions() === [];
    }
}
