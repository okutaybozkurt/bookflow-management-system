<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

/** Swagger belgesi: giriş yapmış müşteri uçları. */
final class CustomerEndpoints
{
    #[OA\Get(
        path: '/favorites',
        summary: 'Favori kitaplarım',
        security: [['bearerAuth' => []]],
        tags: ['Favoriler'],
        parameters: [new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer')), new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Favori kitaplar', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Book')), new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'), new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')])), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function favorites() {}

    #[OA\Post(
        path: '/favorites/{book}',
        summary: 'Favoriye ekle',
        security: [['bearerAuth' => []]],
        tags: ['Favoriler'],
        parameters: [new OA\Parameter(name: 'book', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 201, description: 'Eklendi'), new OA\Response(response: 200, description: 'Zaten favoride'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function addFavorite() {}

    #[OA\Delete(
        path: '/favorites/{book}',
        summary: 'Favoriden çıkar',
        security: [['bearerAuth' => []]],
        tags: ['Favoriler'],
        parameters: [new OA\Parameter(name: 'book', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'Çıkarıldı'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function removeFavorite() {}

    #[OA\Post(
        path: '/books/{book}/reviews',
        summary: 'Yorum ekle (kitap başına tek yorum)',
        security: [['bearerAuth' => []]],
        tags: ['Yorumlar'],
        parameters: [new OA\Parameter(name: 'book', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['rating'], properties: [new OA\Property(property: 'rating', type: 'integer', example: 5), new OA\Property(property: 'comment', type: 'string', example: 'Çok beğendim')])),
        responses: [new OA\Response(response: 201, description: 'Yorum eklendi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Review')])), new OA\Response(response: 409, ref: '#/components/responses/Conflict'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function addReview() {}

    #[OA\Put(
        path: '/reviews/{review}',
        summary: 'Yorumu güncelle (yalnızca sahibi)',
        security: [['bearerAuth' => []]],
        tags: ['Yorumlar'],
        parameters: [new OA\Parameter(name: 'review', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: [], properties: [new OA\Property(property: 'rating', type: 'integer', example: 4), new OA\Property(property: 'comment', type: 'string', example: 'Çok beğendim')])),
        responses: [new OA\Response(response: 200, description: 'Güncellendi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Review')])), new OA\Response(response: 403, ref: '#/components/responses/Forbidden'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function updateReview() {}

    #[OA\Delete(
        path: '/reviews/{review}',
        summary: 'Yorumu sil (sahibi veya yönetici)',
        security: [['bearerAuth' => []]],
        tags: ['Yorumlar'],
        parameters: [new OA\Parameter(name: 'review', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 204, description: 'Silindi'), new OA\Response(response: 403, ref: '#/components/responses/Forbidden'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function deleteReview() {}

    #[OA\Get(
        path: '/orders',
        summary: 'Siparişlerim',
        security: [['bearerAuth' => []]],
        tags: ['Siparişler'],
        parameters: [new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer')), new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Kendi siparişleriniz', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Order')), new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'), new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta')])), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function orders() {}

    #[OA\Post(
        path: '/orders',
        summary: 'Sipariş ver (fiyat/kargo sunucuda hesaplanır, stok düşer)',
        security: [['bearerAuth' => []]],
        tags: ['Siparişler'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(required: ['items', 'shipping_address'], properties: [new OA\Property(property: 'items', type: 'array', items: new OA\Items(properties: [new OA\Property(property: 'book_id', type: 'integer', example: 1), new OA\Property(property: 'quantity', type: 'integer', example: 2)], type: 'object')), new OA\Property(property: 'shipping_address', type: 'string', example: 'Atatürk Cd. No:1 Kadıköy İstanbul')])),
        responses: [new OA\Response(response: 201, description: 'Sipariş oluşturuldu', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Order')])), new OA\Response(response: 409, description: 'Yetersiz stok'), new OA\Response(response: 422, ref: '#/components/responses/ValidationError'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function placeOrder() {}

    #[OA\Get(
        path: '/orders/{order}',
        summary: 'Sipariş detayı (yalnızca kendi siparişiniz)',
        security: [['bearerAuth' => []]],
        tags: ['Siparişler'],
        parameters: [new OA\Parameter(name: 'order', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'Sipariş', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Order')])), new OA\Response(response: 403, ref: '#/components/responses/Forbidden'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function order() {}

    #[OA\Post(
        path: '/orders/{order}/cancel',
        summary: 'Bekleyen siparişi iptal et (stok iade edilir)',
        security: [['bearerAuth' => []]],
        tags: ['Siparişler'],
        parameters: [new OA\Parameter(name: 'order', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [new OA\Response(response: 200, description: 'İptal edildi', content: new OA\JsonContent(properties: [new OA\Property(property: 'data', ref: '#/components/schemas/Order')])), new OA\Response(response: 403, ref: '#/components/responses/Forbidden'), new OA\Response(response: 409, ref: '#/components/responses/Conflict'), new OA\Response(response: 404, ref: '#/components/responses/NotFound'), new OA\Response(response: 401, ref: '#/components/responses/Unauthorized')]
    )]
    public function cancelOrder() {}
}
