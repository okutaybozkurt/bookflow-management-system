<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ConflictException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AuthorRequest;
use App\Http\Resources\AuthorResource;
use App\Models\Author;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class AuthorController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return AuthorResource::collection(Author::withCount('books')->orderBy('name')->get());
    }

    public function store(AuthorRequest $request): JsonResponse
    {
        $author = Author::create($request->validated());

        return (new AuthorResource($author))->response()->setStatusCode(201);
    }

    public function update(AuthorRequest $request, Author $author): AuthorResource
    {
        $author->update($request->validated());

        return new AuthorResource($author);
    }

    public function destroy(Author $author): Response
    {
        if ($author->books()->withTrashed()->exists()) {
            throw new ConflictException('Bu yazara ait kitaplar olduğu için silinemez.');
        }

        $author->delete();

        return response()->noContent();
    }
}
