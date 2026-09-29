# BookFlow – Kod Mimarisi ve Prensipler

## Klasör yapısı

```
backend/    Laravel 13 REST API (PHP 8.3+, MySQL, Sanctum)
frontend/   React (Next.js) arayüzü – yalnızca API istemcisi
docs/       ER diyagramı, şema, mimari notlar
```

## Backend katmanları (SOLID)

| Katman | Sorumluluk | Prensip |
|---|---|---|
| `Http/Controllers` | İstek al, servisi çağır, Resource döndür. İş kuralı içermez. | Single Responsibility |
| `Http/Requests` | Doğrulama kuralları (Form Request). | Single Responsibility |
| `Http/Resources` | JSON çıktı biçimi (şifre vb. sızmaz). | Single Responsibility |
| `Services` | İş kuralları (sipariş oluşturma, stok düşme, raporlar), `DB::transaction`. | Single Responsibility, Dependency Inversion |
| `Repositories` (gerektiği yerde) | Karmaşık sorgular, arayüz (interface) arkasında. | Dependency Inversion, Open/Closed |
| `Policies` / middleware | Yetkilendirme (admin, kaynak sahibi). | Single Responsibility |
| `Enums` | Rol ve sipariş durumu; durum geçiş kuralları enum içinde. | Open/Closed |
| `Observers` / `LogsActivity` | Aktivite logunu modellere dokunmadan yazar. | Open/Closed |

## Kullanılacak tasarım desenleri

- **Service Layer** – iş mantığı controller'dan ayrılır.
- **Repository** – yalnızca gerçekten karmaşık sorgularda (raporlar); gereksiz soyutlama yapılmaz.
- **Observer** – model olaylarından (created/updated/deleted) activity log üretir.
- **Strategy** – sipariş durum geçişleri (`OrderStatus::canTransitionTo`).
- **Dependency Injection** – Laravel service container ile.
- **DTO / Form Request** – doğrulanmış veri servislere tipli olarak geçer.

## Soft delete politikası

- `users`, `books`: soft delete (geçmiş siparişler bozulmaz, geri getirilebilir).
- `orders`: silinmez, `cancelled` durumuna alınır.
- `authors`, `categories`: kitabı varsa silinemez (FK `RESTRICT`, API'de `409`).

## Activity log

`activity_logs` tablosu; kim, ne zaman, hangi kayıt üzerinde hangi işlemi yaptı (eski/yeni değerlerle) bilgisini tutar. Admin panelinde listelenir ve filtrelenir. Yalnızca anlamlı işlemler kaydedilir: giriş, kitap/kullanıcı CRUD, sipariş oluşturma ve durum değişimi.

## Clean Code kuralları

- Anlamlı isimler, kısa metotlar, tek sorumluluk.
- Controller'da iş kuralı, ham SQL veya doğrulama yok.
- Tüm hata yanıtları tek formatta: `{ "message": "...", "errors": { ... } }` ve doğru HTTP durum kodu.
- Her iş kuralı için feature test (`php artisan test`).
