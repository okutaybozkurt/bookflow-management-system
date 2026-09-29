<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ConflictException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CategoryResource::collection(Category::withCount('books')->orderBy('name')->get());
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());

        return (new CategoryResource($category))->response()->setStatusCode(201);
    }

    public function update(CategoryRequest $request, Category $category): CategoryResource
    {
        // Ad değişince slug da yeniden üretilsin.
        $category->update($request->validated() + ['slug' => null]);

        return new CategoryResource($category);
    }

    public function destroy(Category $category): Response
    {
        if ($category->books()->withTrashed()->exists()) {
            throw new ConflictException('Bu kategoriye ait kitaplar olduğu için silinemez.');
        }

        $category->delete();

        return response()->noContent();
    }
}
