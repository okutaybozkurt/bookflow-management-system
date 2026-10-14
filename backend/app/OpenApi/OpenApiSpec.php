<?php

namespace App\OpenApi;

use OpenApi\Attributes as OA;

/**
 * Swagger/OpenAPI genel tanımı: bilgi, sunucu, güvenlik şeması, etiketler,
 * ortak yanıtlar (401/403/404/409/422/429) ve ortak şemalar.
 * Uç noktaların kendisi diğer dosyalardadır (kontrolcülerden ayrı tutulur).
 */
#[OA\Info(
    version: '1.0.0',
    title: 'KitapÜssü (BookFlow) REST API',
    description: "Kitap satışı ve stok yönetimi API'si.\n\n**Nasıl denenir?** Önce `POST /auth/login` ile giriş yapın (örn. `admin@bookflow.com` / `Admin1234`), dönen `token` değerini sağ üstteki **Authorize** düğmesine yapıştırın. Kilitli uçlar bundan sonra çalışır.\n\n**Hata biçimi:** Tüm hatalar `{ \"message\": \"...\" }` biçimindedir; doğrulama hatalarında ayrıca `errors` alanı bulunur."
)]
#[OA\Server(url: '/api', description: 'Bu sunucu')]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Sanctum token',
    description: 'Giriş/kayıt cevabındaki token değeri'
)]
#[OA\Tag(name: 'Kimlik Doğrulama', description: 'Kayıt, giriş, çıkış, profil')]
#[OA\Tag(name: 'Kitaplar', description: 'Herkese açık kitap listesi ve detayı')]
#[OA\Tag(name: 'Kategori ve Yazarlar', description: 'Herkese açık listeler')]
#[OA\Tag(name: 'Favoriler', description: 'Giriş yapmış kullanıcının favorileri')]
#[OA\Tag(name: 'Yorumlar', description: 'Kitap yorumları ve puanları')]
#[OA\Tag(name: 'Siparişler', description: 'Müşterinin kendi siparişleri')]
#[OA\Tag(name: 'Yönetici - Kitaplar', description: 'Yalnızca admin: kitap CRUD ve soft delete')]
#[OA\Tag(name: 'Yönetici - Kategori ve Yazarlar', description: 'Yalnızca admin')]
#[OA\Tag(name: 'Yönetici - Kullanıcılar', description: 'Yalnızca admin: kullanıcı yönetimi')]
#[OA\Tag(name: 'Yönetici - Siparişler', description: 'Yalnızca admin: tüm siparişler ve durum güncelleme')]
#[OA\Tag(name: 'Yönetici - Raporlar', description: 'Yalnızca admin: satış/gelir raporları')]
#[OA\Tag(name: 'Yönetici - İşlem Kayıtları', description: 'Yalnızca admin: activity log')]
#[OA\Response(
    response: 'Unauthorized',
    description: '401 – Oturum yok, token geçersiz/süresi dolmuş',
    content: new OA\JsonContent(ref: '#/components/schemas/Error', example: ['message' => 'Oturum açmanız gerekiyor.'])
)]
#[OA\Response(
    response: 'Forbidden',
    description: '403 – Yetki yok',
    content: new OA\JsonContent(ref: '#/components/schemas/Error', example: ['message' => 'Bu işlem için yetkiniz yok.'])
)]
#[OA\Response(
    response: 'NotFound',
    description: '404 – Kayıt bulunamadı',
    content: new OA\JsonContent(ref: '#/components/schemas/Error', example: ['message' => 'Kayıt bulunamadı.'])
)]
#[OA\Response(
    response: 'Conflict',
    description: '409 – İş kuralı ihlali (yetersiz stok, ilişkili kayıt, geçersiz durum geçişi...)',
    content: new OA\JsonContent(ref: '#/components/schemas/Error')
)]
#[OA\Response(
    response: 'ValidationError',
    description: '422 – Doğrulama hatası',
    content: new OA\JsonContent(ref: '#/components/schemas/ValidationError')
)]
#[OA\Response(
    response: 'TooManyRequests',
    description: '429 – Çok fazla deneme (giriş/kayıt dakikada 10)',
    content: new OA\JsonContent(ref: '#/components/schemas/Error')
)]
#[OA\Schema(schema: 'Error', properties: [new OA\Property(property: 'message', type: 'string')])]
#[OA\Schema(
    schema: 'ValidationError',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'İlk hata mesajı (örn. Kategori adı zorunludur.)'),
        new OA\Property(property: 'errors', type: 'object', example: ['alan_adi' => ['Bu alana ait hata mesajı.']]),
    ]
)]
#[OA\Schema(
    schema: 'User',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'email', type: 'string', format: 'email'),
        new OA\Property(property: 'role', type: 'string', enum: ['customer', 'admin']),
        new OA\Property(property: 'phone', type: 'string', nullable: true),
        new OA\Property(property: 'address', type: 'string', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Author',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'biography', type: 'string', nullable: true),
    ]
)]
#[OA\Schema(
    schema: 'Category',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'slug', type: 'string'),
    ]
)]
#[OA\Schema(
    schema: 'Book',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'title', type: 'string'),
        new OA\Property(property: 'isbn', type: 'string', nullable: true),
        new OA\Property(property: 'price', type: 'number', format: 'float'),
        new OA\Property(property: 'stock', type: 'integer'),
        new OA\Property(property: 'cover_image', type: 'string', nullable: true),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'page_count', type: 'integer', nullable: true),
        new OA\Property(property: 'published_year', type: 'integer', nullable: true),
        new OA\Property(property: 'language', type: 'string'),
        new OA\Property(property: 'is_active', type: 'boolean'),
        new OA\Property(property: 'author', ref: '#/components/schemas/Author'),
        new OA\Property(property: 'category', ref: '#/components/schemas/Category'),
        new OA\Property(property: 'deleted_at', type: 'string', format: 'date-time', nullable: true),
    ]
)]
#[OA\Schema(
    schema: 'Review',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'rating', type: 'integer', minimum: 1, maximum: 5),
        new OA\Property(property: 'comment', type: 'string', nullable: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'Order',
    properties: [
        new OA\Property(property: 'id', type: 'integer'),
        new OA\Property(property: 'status', type: 'string', enum: ['pending', 'shipped', 'delivered', 'cancelled']),
        new OA\Property(property: 'subtotal', type: 'number'),
        new OA\Property(property: 'shipping_cost', type: 'number'),
        new OA\Property(property: 'total', type: 'number'),
        new OA\Property(property: 'shipping_address', type: 'string'),
        new OA\Property(property: 'items', type: 'array', items: new OA\Items(type: 'object')),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ]
)]
#[OA\Schema(
    schema: 'PaginationLinks',
    properties: [
        new OA\Property(property: 'first', type: 'string', nullable: true),
        new OA\Property(property: 'last', type: 'string', nullable: true),
        new OA\Property(property: 'prev', type: 'string', nullable: true),
        new OA\Property(property: 'next', type: 'string', nullable: true),
    ]
)]
#[OA\Schema(
    schema: 'PaginationMeta',
    properties: [
        new OA\Property(property: 'current_page', type: 'integer'),
        new OA\Property(property: 'last_page', type: 'integer'),
        new OA\Property(property: 'per_page', type: 'integer'),
        new OA\Property(property: 'total', type: 'integer'),
    ]
)]
final class OpenApiSpec {}
