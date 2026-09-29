<?php

namespace App\Observers;

use App\Services\ActivityLogger;
use Illuminate\Database\Eloquent\Model;

/**
 * Kitap, kategori ve yazar üzerindeki ekleme/güncelleme/silme işlemlerini
 * modellere dokunmadan activity_logs tablosuna yazar (Observer deseni).
 */
class ActivityObserver
{
    /** Sipariş sonrası otomatik stok düşüşü gibi gürültülü değişiklikler loglanmaz. */
    private const IGNORED = ['stock', 'updated_at'];

    private const LABELS = ['Book' => 'Kitap', 'Category' => 'Kategori', 'Author' => 'Yazar'];

    public function __construct(private readonly ActivityLogger $logger) {}

    public function created(Model $model): void
    {
        $this->write('created', 'eklendi', $model);
    }

    public function updated(Model $model): void
    {
        $changes = array_diff_key($model->getChanges(), array_flip(self::IGNORED));
        if ($changes === []) {
            return;
        }

        $old = array_intersect_key($model->getOriginal(), $changes);
        $this->write('updated', 'güncellendi', $model, ['old' => $old, 'new' => $changes]);
    }

    public function deleted(Model $model): void
    {
        $this->write('deleted', 'silindi', $model);
    }

    public function restored(Model $model): void
    {
        $this->write('restored', 'geri getirildi', $model);
    }

    private function write(string $action, string $verb, Model $model, array $props = []): void
    {
        $label = self::LABELS[class_basename($model)] ?? class_basename($model);
        $name = $model->title ?? $model->name ?? '#'.$model->getKey();

        $this->logger->log($action, "{$label} {$verb}: {$name}", $model, $props);
    }
}
