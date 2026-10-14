<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

/** Swagger belgesi: yalnızca yönetici (admin) uçları. */
final class AdminEndpoints
{
    #[OA\Get(
        path: '/admin/books',
        summary: 'Tüm kitaplar (pasif ve silinenler dahil)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kitaplar'],
        parameters: [new OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string')), new OA\Parameter(name: 'with_trashed', in: 'query', description: 'Silinenleri de getir', schema: new OA\Schema(type: 'boolean')), new OA\Parameter(name: 'is_active', in: 'query', schema: new OA\Schema(type: 'boolean')), new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer')), new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Kitap listesi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Book')), new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'), new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')])), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function adminBooks() {}

    #[OA\Get(
        path: '/admin/books/{id}',
        summary: 'Kitap detayı (silinmiş dahil)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kitaplar'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Kitap', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Book')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function adminBook() {}

    #[OA\Post(
        path: '/admin/books',
        summary: 'Kitap ekle (kapak için multipart/form-data, alan: cover)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kitaplar'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['title', 'price', 'stock', 'author_id', 'category_id'], properties: [new OA\Property(property: 'title', type: 'string', example: 'Yeni Kitap'), new OA\Property(property: 'isbn', type: 'string'), new OA\Property(property: 'price', type: 'number', example: 99.9), new OA\Property(property: 'stock', type: 'integer', example: 10), new OA\Property(property: 'author_id', type: 'integer', example: 1), new OA\Property(property: 'category_id', type: 'integer', example: 1), new OA\Property(property: 'description', type: 'string'), new OA\Property(property: 'page_count', type: 'integer'), new OA\Property(property: 'published_year', type: 'integer'), new OA\Property(property: 'language', type: 'string'), new OA\Property(property: 'is_active', type: 'boolean')])),
        responses: [new OA\Response(response: 201, description: 'Oluşturuldu', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Book')])), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function createBook() {}

    #[OA\Put(
        path: '/admin/books/{book}',
        summary: 'Kitap güncelle (PATCH de desteklenir)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kitaplar'],
        parameters: [new OA\Parameter(name: 'book', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: [], properties: [new OA\Property(property: 'title', type: 'string'), new OA\Property(property: 'price', type: 'number'), new OA\Property(property: 'stock', type: 'integer'), new OA\Property(property: 'is_active', type: 'boolean')])),
        responses: [new OA\Response(response: 200, description: 'Güncellendi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Book')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function updateBook() {}

    #[OA\Delete(
        path: '/admin/books/{book}',
        summary: 'Kitabı sil (soft delete)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kitaplar'],
        parameters: [new OA\Parameter(name: 'book', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'Silindi'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function deleteBook() {}

    #[OA\Post(
        path: '/admin/books/{book}/restore',
        summary: 'Silinen kitabı geri getir',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kitaplar'],
        parameters: [new OA\Parameter(name: 'book', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Geri getirildi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Book')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function restoreBook() {}

    #[OA\Post(
        path: '/admin/categories',
        summary: 'Kategori ekle',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kategori ve Yazarlar'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['name'], properties: [new OA\Property(property: 'name', type: 'string', example: 'Tarih')])),
        responses: [new OA\Response(response: 201, description: 'Oluşturuldu', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Category')])), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function createCategory() {}

    #[OA\Put(
        path: '/admin/categories/{category}',
        summary: 'Kategori güncelle',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kategori ve Yazarlar'],
        parameters: [new OA\Parameter(name: 'category', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['name'], properties: [new OA\Property(property: 'name', type: 'string')])),
        responses: [new OA\Response(response: 200, description: 'Güncellendi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Category')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function updateCategory() {}

    #[OA\Delete(
        path: '/admin/categories/{category}',
        summary: 'Kategori sil (kitabı varsa 409)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kategori ve Yazarlar'],
        parameters: [new OA\Parameter(name: 'category', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'Silindi'), new OA\Response(response: 409, ref: '#/components/responses/Conflict'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function deleteCategory() {}

    #[OA\Post(
        path: '/admin/authors',
        summary: 'Yazar ekle',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kategori ve Yazarlar'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['name'], properties: [new OA\Property(property: 'name', type: 'string', example: 'Yeni Yazar'), new OA\Property(property: 'biography', type: 'string')])),
        responses: [new OA\Response(response: 201, description: 'Oluşturuldu', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Author')])), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function createAuthor() {}

    #[OA\Put(
        path: '/admin/authors/{author}',
        summary: 'Yazar güncelle',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kategori ve Yazarlar'],
        parameters: [new OA\Parameter(name: 'author', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['name'], properties: [new OA\Property(property: 'name', type: 'string'), new OA\Property(property: 'biography', type: 'string')])),
        responses: [new OA\Response(response: 200, description: 'Güncellendi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Author')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function updateAuthor() {}

    #[OA\Delete(
        path: '/admin/authors/{author}',
        summary: 'Yazar sil (kitabı varsa 409)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kategori ve Yazarlar'],
        parameters: [new OA\Parameter(name: 'author', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'Silindi'), new OA\Response(response: 409, ref: '#/components/responses/Conflict'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function deleteAuthor() {}

    #[OA\Get(
        path: '/admin/users',
        summary: 'Kullanıcıları listele',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kullanıcılar'],
        parameters: [new OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string')), new OA\Parameter(name: 'role', in: 'query', schema: new OA\Schema(type: 'string', enum: ['customer', 'admin'])), new OA\Parameter(name: 'with_trashed', in: 'query', schema: new OA\Schema(type: 'boolean')), new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer')), new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Kullanıcı listesi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/User')), new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'), new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')])), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function users() {}

    #[OA\Post(
        path: '/admin/users',
        summary: 'Kullanıcı oluştur',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kullanıcılar'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['name', 'email', 'password', 'role'], properties: [new OA\Property(property: 'name', type: 'string'), new OA\Property(property: 'email', type: 'string', example: 'yeni@example.com'), new OA\Property(property: 'password', type: 'string', example: 'Sifre1234'), new OA\Property(property: 'role', type: 'string', example: 'customer')])),
        responses: [new OA\Response(response: 201, description: 'Oluşturuldu', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/User')])), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function createUser() {}

    #[OA\Get(
        path: '/admin/users/{user}',
        summary: 'Kullanıcı detayı',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kullanıcılar'],
        parameters: [new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Kullanıcı', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/User')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function user() {}

    #[OA\Put(
        path: '/admin/users/{user}',
        summary: 'Kullanıcı güncelle (kendi rolünü değiştirme engelli)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kullanıcılar'],
        parameters: [new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: [], properties: [new OA\Property(property: 'name', type: 'string'), new OA\Property(property: 'email', type: 'string'), new OA\Property(property: 'role', type: 'string')])),
        responses: [new OA\Response(response: 200, description: 'Güncellendi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/User')])), new OA\Response(response: 409, ref: '#/components/responses/Conflict'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function updateUser() {}

    #[OA\Delete(
        path: '/admin/users/{user}',
        summary: 'Kullanıcıyı sil (soft delete, kendini silemez)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kullanıcılar'],
        parameters: [new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'Silindi'), new OA\Response(response: 409, ref: '#/components/responses/Conflict'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function deleteUser() {}

    #[OA\Post(
        path: '/admin/users/{user}/restore',
        summary: 'Silinen kullanıcıyı geri getir',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Kullanıcılar'],
        parameters: [new OA\Parameter(name: 'user', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Geri getirildi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/User')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function restoreUser() {}

    #[OA\Get(
        path: '/admin/orders',
        summary: 'Tüm siparişler',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Siparişler'],
        parameters: [new OA\Parameter(name: 'status', in: 'query', schema: new OA\Schema(type: 'string', enum: ['pending', 'shipped', 'delivered', 'cancelled'])), new OA\Parameter(name: 'search', in: 'query', schema: new OA\Schema(type: 'string')), new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer')), new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Sipariş listesi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Order')), new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'), new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')])), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function adminOrders() {}

    #[OA\Get(
        path: '/admin/orders/{order}',
        summary: 'Sipariş detayı',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Siparişler'],
        parameters: [new OA\Parameter(name: 'order', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Sipariş', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Order')])), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function adminOrder() {}

    #[OA\Patch(
        path: '/admin/orders/{order}/status',
        summary: 'Sipariş durumu güncelle (pending → shipped → delivered, iptal)',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Siparişler'],
        parameters: [new OA\Parameter(name: 'order', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['status'], properties: [new OA\Property(property: 'status', type: 'string', example: 'shipped')])),
        responses: [new OA\Response(response: 200, description: 'Güncellendi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Order')])), new OA\Response(response: 409, ref: '#/components/responses/Conflict'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function updateOrderStatus() {}

    #[OA\Get(
        path: '/admin/reports/summary',
        summary: 'Özet: toplam gelir, sipariş, satılan kitap, düşük stok, müşteri',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Raporlar'],
        responses: [new OA\Response(response: 200, description: 'Özet'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function reportSummary() {}

    #[OA\Get(
        path: '/admin/reports/sales',
        summary: 'Dönemsel gelir',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Raporlar'],
        parameters: [new OA\Parameter(name: 'period', in: 'query', schema: new OA\Schema(type: 'string', enum: ['monthly', 'yearly'])), new OA\Parameter(name: 'count', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Satış serisi'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function reportSales() {}

    #[OA\Get(
        path: '/admin/reports/top-books',
        summary: 'Çok satan kitaplar',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Raporlar'],
        parameters: [new OA\Parameter(name: 'limit', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Liste'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function reportTopBooks() {}

    #[OA\Get(
        path: '/admin/reports/categories',
        summary: 'Kategori bazlı satışlar',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Raporlar'],
        responses: [new OA\Response(response: 200, description: 'Liste'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function reportCategories() {}

    #[OA\Get(
        path: '/admin/reports/low-stock',
        summary: 'Düşük stoklu kitaplar',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - Raporlar'],
        responses: [new OA\Response(response: 200, description: 'Liste'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function reportLowStock() {}

    #[OA\Get(
        path: '/admin/activity-logs',
        summary: 'İşlem kayıtları',
        security: [['bearerAuth' => []]],
        tags: ['Yönetici - İşlem Kayıtları'],
        parameters: [new OA\Parameter(name: 'user_id', in: 'query', schema: new OA\Schema(type: 'integer')), new OA\Parameter(name: 'action', in: 'query', schema: new OA\Schema(type: 'string')), new OA\Parameter(name: 'subject_type', in: 'query', schema: new OA\Schema(type: 'string')), new OA\Parameter(name: 'from', in: 'query', description: 'YYYY-MM-DD', schema: new OA\Schema(type: 'string')), new OA\Parameter(name: 'to', in: 'query', description: 'YYYY-MM-DD', schema: new OA\Schema(type: 'string')), new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer')), new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Kayıt listesi'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden')]
    )]
    public function activityLogs() {}
}
