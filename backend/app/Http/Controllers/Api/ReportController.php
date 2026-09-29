<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reports) {}

    public function summary(): JsonResponse
    {
        return response()->json(['data' => $this->reports->summary()]);
    }

    public function sales(Request $request): JsonResponse
    {
        $data = $request->validate([
            'period' => ['nullable', 'in:monthly,yearly'],
            'count' => ['nullable', 'integer', 'min:1', 'max:36'],
        ]);

        $period = $data['period'] ?? 'monthly';
        $count = $data['count'] ?? ($period === 'monthly' ? 12 : 5);

        return response()->json(['data' => $this->reports->sales($period, $count)]);
    }

    public function topBooks(Request $request): JsonResponse
    {
        $limit = $request->validate(['limit' => ['nullable', 'integer', 'min:1', 'max:50']])['limit'] ?? 10;

        return response()->json(['data' => $this->reports->topBooks($limit)]);
    }

    public function categories(): JsonResponse
    {
        return response()->json(['data' => $this->reports->salesByCategory()]);
    }

    public function lowStock(): JsonResponse
    {
        return response()->json(['data' => $this->reports->lowStock()]);
    }
}
