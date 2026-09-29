<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $books = $request->user()->favoriteBooks()
            ->where('is_active', true)->with(['author', 'category'])->withStats()
            ->orderByPivot('created_at', 'desc')->get();

        return BookResource::collection($books);
    }

    /** Aynı kitabı tekrar eklemek hata değil; işlem idempotent. */
    public function store(Request $request, Book $book): JsonResponse
    {
        $result = $request->user()->favoriteBooks()->syncWithoutDetaching([$book->id]);

        return response()->json(
            ['message' => 'Favorilere eklendi.'],
            count($result['attached']) ? 201 : 200
        );
    }

    public function destroy(Request $request, Book $book): Response
    {
        $request->user()->favoriteBooks()->detach($book->id);

        return response()->noContent();
    }
}
