<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/** İş kuralı ihlali (yetersiz stok, ilişkili kayıt vb.) → HTTP 409. */
class ConflictException extends Exception
{
    public function render(): JsonResponse
    {
        return response()->json(['message' => $this->getMessage()], 409);
    }
}
