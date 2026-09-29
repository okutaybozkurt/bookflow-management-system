<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BookRequest;
use App\Http\Requests\BookIndexRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use App\Services\BookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class BookController extends Controller
{
    public function __construct(private readonly BookService $books) {}

    /** Herkese açık liste: yalnızca aktif kitaplar. */
    public function index(BookIndexRequest $request): AnonymousResourceCollection
    {
        return $this->paginated($request, Book::query()->active());
    }

    /** Yönetici listesi: pasif kitaplar ve (isteğe bağlı) silinmişler dahil. */
    public function adminIndex(BookIndexRequest $request): AnonymousResourceCollection
    {
        $query = Book::query();
        if ($request->boolean('with_trashed')) {
            $query->withTrashed();
        }

        return $this->paginated($request, $query);
    }

    public function show(Book $book): BookResource
    {
        abort_unless($book->is_active, 404);

        return new BookResource($this->loadDetails($book));
    }

    public function adminShow(int $id): BookResource
    {
        return new BookResource($this->loadDetails(Book::withTrashed()->findOrFail($id)));
    }

    public function store(BookRequest $request): JsonResponse
    {
        $book = $this->books->create($request->safe()->except('cover'), $request->file('cover'));

        return (new BookResource($book))->response()->setStatusCode(201);
    }

    public function update(BookRequest $request, Book $book): BookResource
    {
        return new BookResource(
            $this->books->update($book, $request->safe()->except('cover'), $request->file('cover'))
        );
    }

    public function destroy(Book $book): Response
    {
        $book->delete(); // soft delete: sipariş geçmişi korunur

        return response()->noContent();
    }

    public function restore(Book $book): BookResource
    {
        $book->restore();

        return new BookResource($book->load(['author', 'category']));
    }

    private function paginated(BookIndexRequest $request, $query): AnonymousResourceCollection
    {
        $books = $query->with(['author', 'category'])
            ->withStats()
            ->filter($request->validated())
            ->paginate($request->integer('per_page', 12))
            ->withQueryString();

        return BookResource::collection($books);
    }

    private function loadDetails(Book $book): Book
    {
        return Book::withTrashed()->with(['author', 'category'])->withStats()->findOrFail($book->id);
    }
}
