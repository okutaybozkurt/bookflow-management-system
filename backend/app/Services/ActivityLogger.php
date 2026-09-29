<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;

/** Kullanıcı işlemlerini `activity_logs` tablosuna yazan tek nokta. */
class ActivityLogger
{
    private static bool $muted = false;

    /** Verilen işlem sırasında log yazımını kapatır (ör. başlangıç verisi yüklenirken). */
    public static function muted(callable $callback): void
    {
        $previous = self::$muted;
        self::$muted = true;

        try {
            $callback();
        } finally {
            self::$muted = $previous;
        }
    }

    public function log(
        string $action,
        string $description,
        ?Model $subject = null,
        array $properties = [],
        ?int $userId = null,
    ): ?ActivityLog {
        if (self::$muted) {
            return null;
        }

        return ActivityLog::create([
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'subject_type' => $subject ? class_basename($subject) : null,
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $properties ?: null,
            'ip_address' => request()->ip(),
        ]);
    }
}
