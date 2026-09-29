<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ConflictException;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Book;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ReviewController extends Controller
{
    public function index(Book $book): AnonymousResourceCollection
    {
        return ReviewResource::collection(
            $book->reviews()->with('user')->latest('id')->paginate(10)
        );
    }

    public function store(ReviewRequest $request, Book $book): JsonResponse
    {
        if ($book->reviews()->where('user_id', $request->user()->id)->exists()) {
            throw new ConflictException('Bu kitabı zaten değerlendirdiniz. Mevcut yorumunuzu güncelleyebilirsiniz.');
        }

        $review = $book->reviews()->create($request->validated() + ['user_id' => $request->user()->id]);

        return (new ReviewResource($review->load('user')))->response()->setStatusCode(201);
    }

    public function update(ReviewRequest $request, Review $review): ReviewResource
    {
        $this->authorize('update', $review);
        $review->update($request->validated());

        return new ReviewResource($review->load('user'));
    }

    public function destroy(Review $review): Response
    {
        $this->authorize('delete', $review);
        $review->delete();

        return response()->noContent();
    }
}
