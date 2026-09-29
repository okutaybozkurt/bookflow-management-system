<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DemoDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DemoController extends Controller
{
    public function __construct(private readonly DemoDataService $demo) {}

    public function reset(Request $request): JsonResponse
    {
        $mode = $request->validate([
            'mode' => ['required', 'in:'.implode(',', DemoDataService::MODES)],
        ], [
            'mode.required' => 'Mod seçilmelidir (golden veya junk).',
            'mode.in' => 'Geçersiz mod. golden veya junk olmalıdır.',
        ])['mode'];

        return response()->json([
            'message' => $mode === 'golden' ? 'Sunum verisi yüklendi.' : 'Demo (kirli) verisi yüklendi.',
            'data' => $this->demo->reset($mode),
        ]);
    }
}
