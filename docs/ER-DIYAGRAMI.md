# BookFlow – Veritabanı Mimarisi (MySQL)

Şemanın tek kaynağı `backend/database/migrations` klasörüdür. `docs/schema.sql` bunun MySQL çıktısıdır.

## ER Diyagramı

```mermaid
erDiagram
    USERS ||--o{ ORDERS : "verir"
    USERS ||--o{ FAVORITES : "ekler"
    USERS ||--o{ REVIEWS : "yazar"
    USERS |o--o{ ACTIVITY_LOGS : "gerçekleştirir"
    AUTHORS ||--o{ BOOKS : "yazar"
    CATEGORIES ||--o{ BOOKS : "içerir"
    BOOKS ||--o{ ORDER_ITEMS : "satılır"
    BOOKS ||--o{ FAVORITES : "favorilenir"
    BOOKS ||--o{ REVIEWS : "değerlendirilir"
    ORDERS ||--|{ ORDER_ITEMS : "içerir"

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password "bcrypt hash"
        enum role "customer | admin"
        varchar phone
        text address
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "soft delete"
    }
    AUTHORS {
        bigint id PK
        varchar name UK
        text biography
        timestamp created_at
        timestamp updated_at
    }
    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar slug UK
        timestamp created_at
        timestamp updated_at
    }
    BOOKS {
        bigint id PK
        varchar title
        varchar isbn UK
        decimal price
        int stock
        varchar cover_image
        text description
        smallint page_count
        smallint published_year
        varchar language
        boolean is_active
        bigint author_id FK
        bigint category_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at "soft delete"
    }
    ORDERS {
        bigint id PK
        varchar order_number UK
        bigint user_id FK
        enum status "pending | shipped | delivered | cancelled"
        decimal subtotal
        decimal shipping_fee
        decimal total
        text shipping_address
        timestamp created_at
        timestamp updated_at
    }
    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint book_id FK
        int quantity
        decimal unit_price "sipariş anındaki fiyat"
        decimal line_total
    }
    FAVORITES {
        bigint user_id PK,FK
        bigint book_id PK,FK
        timestamp created_at
    }
    REVIEWS {
        bigint id PK
        bigint user_id FK
        bigint book_id FK
        tinyint rating "1-5"
        text comment
        timestamp created_at
        timestamp updated_at
    }
    ACTIVITY_LOGS {
        bigint id PK
        bigint user_id FK "nullable"
        varchar action
        varchar subject_type
        bigint subject_id
        varchar description
        json properties "eski/yeni değerler"
        varchar ip_address
        timestamp created_at
    }
```

Ayrıca Laravel Sanctum'un oluşturduğu `personal_access_tokens` tablosu vardır (giriş token'ları, `tokenable_type/tokenable_id` ile kullanıcıya bağlanır).

## Tasarım kararları

| Karar | Gerekçe |
|---|---|
| `users` ve `books` **soft delete** | Silinen kitap/kullanıcı, geçmiş siparişleri bozmaz. |
| `order_items.unit_price` | Kitabın fiyatı sonradan değişse de eski siparişin tutarı sabit kalır. |
| Satış adedi tabloda tutulmaz | `order_items` toplamından hesaplanır; `sold` gibi tutarsız olabilecek kopya alan yoktur. |
| `authors`/`categories` → `books` FK `RESTRICT` | Kitabı olan yazar/kategori silinemez. |
| `orders.status` enum | Akış: pending → shipped → delivered; pending/shipped → cancelled. |
| `activity_logs.user_id` `SET NULL` | Kullanıcı silinse de denetim kaydı korunur. |
| `favorites` bileşik PK, `reviews (user_id, book_id)` unique | Aynı kitap iki kez favorilenemez / iki kez yorumlanamaz. |

## MySQL Workbench'te görüntüleme (macOS)

1. `mysql -u root -p -e "CREATE DATABASE bookflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"`
2. `backend/.env` içinde `DB_*` bilgilerini girin, `cd backend && php artisan migrate`
3. Workbench: **Database → Reverse Engineer…** → `bookflow` şemasını seçin → EER diyagramı oluşur.
   (Alternatif: **File → Run SQL Script…** ile `docs/schema.sql`.)
