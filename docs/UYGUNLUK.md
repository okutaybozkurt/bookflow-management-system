# Ödev Şartlarına Uygunluk Raporu

Kaynak: *Web Tabanlı Teknolojiler Dönem Sonu Projesi* dokümanı (59 satır). Doküman satır satır okunup 32 maddeye (R01–R32) ayrılmış, her madde gerçek MySQL üzerinde çalışan uygulama ile test edilmiştir.

## Test katmanları

| Katman | Sonuç | Ne doğrular? |
|---|---|---|
| PHPUnit (`php artisan test`) | **53 / 53** | İş kuralları, yetki, hata biçimi, soft delete, seeder |
| API + veritabanı denetimi | **83 / 83** | Gerçek MySQL: CRUD, durum kodları, token, eşzamanlılık, kısıtlar, yeniden başlatınca kalıcılık |
| Arayüz denetimi (Chromium) | **52 / 52** | Arayüzden yapılan her işlem API'ye gidip veritabanına yazılıyor mu? Hata mesajları gösteriliyor mu? |

## Madde madde uygunluk

| # | Dokümandaki şart | Durum | Kanıt (nasıl doğrulandı) |
|---|---|---|---|
| R01 | Frontend ve backend katmanlarından oluşan web uygulaması | ✅ | `backend/` (Laravel), `frontend/` (React) |
| R02 | Gerçek bir probleme çözüm, işlevsel uygulama | ✅ | Kitap satışı ve stok yönetimi; tüm akışlar çalışıyor |
| R03 | Veri ve iş mantığını yöneten RESTful API | ✅ | 47 API ucu; kaynak + metot + durum kodu düzeni |
| R04 | CRUD (Create, Read, Update, Delete) | ✅ | Kitap, kategori, yazar, kullanıcı, yorum, favori: 4 işlemin her biri API'de 201/200/204 döner ve DB satırı doğrulanır. Sipariş: oluştur/oku/durum güncelle/iptal |
| R05 | En az bir veritabanı | ✅ | MySQL; `select version()` |
| R06 | API ↔ frontend HTTP/HTTPS iletişimi | ✅ | HTTP + JSON; CORS yalnızca `localhost:3000`'e açık. *(HTTPS yerelde yok; yayında sunucu ayarıyla gelir)* |
| R07 | Temel iş kuralları backend'de | ✅ | Fiyat/toplam/kargo sunucuda (istemci fiyatı yok sayılır), stok düşümü, yetersiz stokta 409, transaction geri alma, durum akışı, iptalde stok iadesi, eşzamanlı siparişte stok korunur |
| R08 | GET, POST, PUT/PATCH, DELETE | ✅ | Beşi de kullanılıyor ve test ediliyor |
| R09 | Uygun HTTP durum kodları | ✅ | 200, 201, 204, 401, 403, 404, 405, 409, 422, 429 |
| R10 | Hatalar ele alınır, anlamlı mesaj | ✅ | Tek biçim `{ message, errors }`, Türkçe; hiçbir hata iç ayrıntı (dosya yolu, izleme) sızdırmaz |
| R11 | Kayıt ve giriş sistemi | ✅ | Kayıt, giriş, çıkış, hatalı şifre 401, tekrar eden e-posta 422 |
| R12 | Uygun kimlik doğrulama/yetkilendirme yöntemi | ✅ | Sanctum Bearer token (DB'de hash), bcrypt şifre, rol + policy, giriş hız sınırı (429) |
| R13 | Frontend, API'yi kullanarak etkileşir | ✅ | Frontend'de veritabanı erişimi yok; tüm veri `lib/services.ts` üzerinden |
| R14 | Platform: web | ✅ | Web uygulaması |
| R15 | API'den veri okur | ✅ | Vitrin, sipariş, favori, rapor, kullanıcı, log |
| R16 | API'ye veri gönderir | ✅ | Kayıt, sipariş, yorum, kitap ekleme (dosya yükleme dahil) |
| R17 | Güncelleyebilir ve silebilir | ✅ | Kitap, kullanıcı, kategori, yazar, yorum, favori, profil, şifre, sipariş durumu |
| R18 | Kullanıcı işlemlerine uygun arayüz | ✅ | Müşteri vitrini + yönetim paneli |
| R19 | Hata ve başarı durumları gösterilir | ✅ | Bildirimler ve form içi API mesajları |
| R20 | Arayüzden kayıt ve giriş | ✅ | Kayıt/giriş penceresi API'ye bağlı |
| R21 | Oturum yönetimi | ✅ | Token; yenilemede `/me` ile geri yükleme; çıkışta silinir; 7 günlük süre; 401 gelince otomatik çıkış |
| R22 | Basit CRUD'dan öte, probleme çözüm | ✅ | Rol bazlı yetki, stok kontrollü sipariş akışı, satış/gelir raporları (DB ile birebir), işlem kayıtları |
| R23 | Backend ve frontend ayrı geliştirilir | ✅ | Ayrı klasör, ayrı port, ayrı bağımlılıklar |
| R24 | API üzerinden veri alışverişi | ✅ | CORS testi; frontend'de `app/api` ve `prisma` yok |
| R25 | En az 5 farklı entity | ✅ | 9 tablo: users, authors, categories, books, orders, order_items, favorites, reviews, activity_logs |
| R26 | Veriler kalıcı olarak veritabanında | ✅ | MySQL ve backend yeniden başlatıldı; veriler yerinde. FK, UNIQUE, ENUM, UNSIGNED kısıtları DB seviyesinde çalışıyor |
| R27 | Frontend API'den aldığı veriyi gösterir | ✅ | Dashboard sayıları DB ile karşılaştırıldı |
| R28 | Frontend'den ekleme, güncelleme, silme | ✅ | Arayüzde yapılan her işlemden sonra ilgili tablo SQL ile kontrol edildi |
| R29 | API hataları frontend'de ele alınır | ✅ | Tekrar eden e-posta, zayıf şifre, hatalı şifre, yetersiz stok (409), silinemeyen kategori (409), yanlış mevcut şifre, **backend kapalıyken** "Sunucuya ulaşılamadı" |
| R30 | Kayıt ve giriş zorunlu | ✅ | Sipariş, favori, yorum, profil ve tüm yönetim işlemleri giriş ister |
| R31 | Kimlik doğrulama ve yetkilendirme mekanizması | ✅ | 401/403 ayrımı, başkasının siparişi/yorumu 403, `localStorage`'a "admin" yazmak işe yaramaz, kayıtta rol atanamaz |
| R32 | Tüm işlevler çalışır; yalnızca arayüzü olan özellik yok | ✅ | Ölü bağlantı yok, boş düğme yok, sahte/statik veri yok, tarayıcıda JS hatası yok, beklenmeyen 5xx yok |

## Bu kontrol sırasında bulunup düzeltilenler

1. **Hata cevabı iç ayrıntı sızdırıyordu:** Yanlış HTTP metoduyla istek atılınca API, sunucudaki dosya yollarını ve tam hata izini JSON içinde döndürüyordu. Artık her hata Türkçe, tek biçimli ve ayrıntısızdır; beklenmeyen hatalar yalnızca `storage/logs/laravel.log`'a yazılır. `.env.example`'da `APP_DEBUG=false` yapıldı.
2. **405 ve 429 mesajları İngilizceydi:** Türkçeleştirildi.
3. **Yetki hatası (403) mesajı yerelleşmiyordu:** Laravel, yetki hatasını dönüştürdüğü için özel mesajımız devreye girmiyordu; düzeltildi.
4. **Arama kutusundaki "Ara" düğmesi işlevsizdi:** Artık aramayı vitrine uygular, sonuçları listeler ve "Aramayı temizle" ile geri alınır.
5. **Vitrin kategori çubuğu sabit yazılmıştı** (veritabanında olmayan kategoriler): API'deki kategorilerden oluşuyor.

## Bilinen sınırlar (dokümanda istenmeyenler)

- HTTPS: yerelde HTTP kullanılır, yayına alınırsa sunucu sertifikasıyla gelir.
- Ödeme altyapısı yok; sipariş müşteri kimliği ve durumuyla kaydedilir, ödeme teslimatta yapılır.
- Sepet, sipariş verilene kadar tarayıcıda tutulur.
- Şifre sıfırlama (e-posta ile) ve siparişin kalıcı silinmesi yok; sipariş iptal edilir.

## Nasıl yeniden çalıştırılır?

```bash
cd backend
php artisan test            # 53 test; iş kuralları, yetki, hata biçimi
```

Sunumdan önce elle kontrol için `BookFlow-API-Anlatim.pdf` içindeki F12 senaryosunu izleyin (Network sekmesinde durum kodları görünür).
