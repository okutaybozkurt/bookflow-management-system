<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

/** Swagger belgesi: kimlik doğrulama ve herkese açık uçlar. */
final class PublicEndpoints
{
    #[OA\Post(
        path: '/auth/register',
        summary: 'Kayıt ol (her zaman müşteri rolü)',
        tags: ['Kimlik Doğrulama'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['name', 'email', 'password'],
            properties: [
                new OA\Property(property: 'name', type: 'string', example: 'Ayşe Yılmaz'),
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'ayse@example.com'),
                new OA\Property(property: 'password', type: 'string', example: 'Sifre1234', description: 'En az 8 karakter, harf ve rakam'),
                new OA\Property(property: 'phone', type: 'string', nullable: true),
                new OA\Property(property: 'address', type: 'string', nullable: true),
            ]
        )),
        responses: [
            new OA\Response(response: 201, description: 'Kayıt başarılı; token döner', content: new OA\JsonContent(properties: [
                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                new OA\Property(property: 'token', type: 'string'),
                new OA\Property(property: 'token_type', type: 'string', example: 'Bearer'),
            ])),
            new OA\Response(response: 422, ref: '#/components/responses/ValidationError'),
            new OA\Response(response: 429, ref: '#/components/responses/TooManyRequests'),
        ]
    )]
    public function register() {}

    #[OA\Post(
        path: '/auth/login',
        summary: 'Giriş yap, token al',
        tags: ['Kimlik Doğrulama'],
        requestBody: new OA\RequestBody(required: true, content: new OA\JsonContent(
            required: ['email', 'password'],
            properties: [
                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@bookflow.com'),
                new OA\Property(property: 'password', type: 'string', example: 'Admin1234'),
            ]
        )),
        responses: [
            new OA\Response(response: 200, description: 'Giriş başarılı; token döner', content: new OA\JsonContent(properties: [
                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                new OA\Property(property: 'token', type: 'string'),
                new OA\Property(property: 'token_type', type: 'string', example: 'Bearer'),
            ])),
            new OA\Response(response: 401, description: 'E-posta veya şifre hatalı', content: new OA\JsonContent(ref: '#/components/schemas/Error')),
            new OA\Response(response: 422, ref: '#/components/responses/ValidationError'),
            new OA\Response(response: 429, ref: '#/components/responses/TooManyRequests'),
        ]
    )]
    public function login() {}

    #[OA\Post(
        path: '/auth/logout',
        summary: 'Çıkış yap (token iptal edilir)',
        security: [['bearerAuth' => []]],
        tags: ['Kimlik Doğrulama'],
        responses: [
            new OA\Response(response: 200, description: 'Çıkış yapıldı'),
            new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'),
        ]
    )]
    public function logout() {}

    #[OA\Get(
        path: '/me',
        summary: 'Giriş yapmış kullanıcının profili',
        security: [['bearerAuth' => []]],
        tags: ['Kimlik Doğrulama'],
        responses: [
            new OA\Response(response: 200, description: 'Profil', content: new OA\JsonContent(properties: [
                new OA\Property(property: 'data', ref: '#/components/schemas/User'),
            ])),
            new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'),
        ]
    )]
    public function me() {}

    #[OA\Put(
        path: '/me',
        summary: 'Profil güncelle (şifre değişimi mevcut şifre ister)',
        security: [['bearerAuth' => []]],
        tags: ['Kimlik Doğrulama'],
        requestBody: new OA\RequestBody(content: new OA\JsonContent(properties: [
            new OA\Property(property: 'name', type: 'string'),
            new OA\Property(property: 'email', type: 'string', format: 'email'),
            new OA\Property(property: 'phone', type: 'string', nullable: true),
            new OA\Property(property: 'address', type: 'string', nullable: true),
            new OA\Property(property: 'current_password', type: 'string', description: 'Şifre değiştirirken zorunlu'),
            new OA\Property(property: 'password', type: 'string'),
        ])),
        responses: [
            new OA\Response(response: 200, description: 'Güncellendi', content: new OA\JsonContent(properties: [
                new OA\Property(property: 'data', ref: '#/components/schemas/User'),
            ])),
            new OA\Response(response: 401, ref: '#/components/responses/Unauthorized'),
            new OA\Response(response: 422, ref: '#/components/responses/ValidationError'),
        ]
    )]
    public function updateProfile() {}

    #[OA\Get(
        path: '/books',
        summary: 'Aktif kitapları listele (arama, filtre, sıralama, sayfalama)',
        tags: ['Kitaplar'],
        parameters: [
            new OA\Parameter(name: 'search', in: 'query', description: 'Başlık, yazar veya ISBN', schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'category_id', in: 'query', schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'author_id', in: 'query', schema: new OA\Schema(type: 'integer')),
            new OA\Parameter(name: 'min_price', in: 'query', schema: new OA\Schema(type: 'number')),
            new OA\Parameter(name: 'max_price', in: 'query', schema: new OA\Schema(type: 'number')),
            new OA\Parameter(name: 'in_stock', in: 'query', schema: new OA\Schema(type: 'boolean')),
            new OA\Parameter(name: 'sort', in: 'query', schema: new OA\Schema(type: 'string', enum: ['newest', 'price_asc', 'price_desc', 'title', 'popular'])),
            new OA\Parameter(name: 'per_page', in: 'query', schema: new OA\Schema(type: 'integer', maximum: 100)),
            new OA\Parameter(name: 'page', in: 'query', schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Sayfalı kitap listesi', content: new OA\JsonContent(properties: [
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Book')),
                new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'),
                new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta'),
            ])),
            new OA\Response(response: 422, ref: '#/components/responses/ValidationError'),
        ]
    )]
    public function books() {}

    #[OA\Get(
        path: '/books/{id}',
        summary: 'Kitap detayı (ortalama puan, satış adedi)',
        tags: ['Kitaplar'],
        parameters: [new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 200, description: 'Kitap', content: new OA\JsonContent(properties: [
                new OA\Property(property: 'data', ref: '#/components/schemas/Book'),
            ])),
            new OA\Response(response: 404, ref: '#/components/responses/NotFound'),
        ]
    )]
    public function book() {}

    #[OA\Get(
        path: '/categories',
        summary: 'Kategorileri listele (kitap sayısıyla)',
        tags: ['Kategori ve Yazarlar'],
        responses: [new OA\Response(response: 200, description: 'Kategori listesi', content: new OA\JsonContent(properties: [
            new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Category')),
        ]))]
    )]
    public function categories() {}

    #[OA\Get(
        path: '/authors',
        summary: 'Yazarları listele (kitap sayısıyla)',
        tags: ['Kategori ve Yazarlar'],
        responses: [new OA\Response(response: 200, description: 'Yazar listesi', content: new OA\JsonContent(properties: [
            new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Author')),
        ]))]
    )]
    public function authors() {}

    #[OA\Get(
        path: '/books/{book}/reviews',
        summary: 'Kitabın yorumları',
        tags: ['Yorumlar'],
        parameters: [new OA\Parameter(name: 'book', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))],
        responses: [
            new OA\Response(response: 200, description: 'Yorum listesi', content: new OA\JsonContent(properties: [
                new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Review')),
            ])),
            new OA\Response(response: 404, ref: '#/components/responses/NotFound'),
        ]
    )]
    public function reviews() {}
}
