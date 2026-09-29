# 🗺️ BookFlow Yol Haritası

Projenin durumunu ve kalan işleri gösterir.

---

## 1. Mimari (Tamamlandı ✅)
- [x] Backend (Laravel REST API) ve frontend (React / Next.js) ayrı klasörlerde: `backend/`, `frontend/`
- [x] MySQL veri modeli: 9 tablo (users, authors, categories, books, orders, order_items, favorites, reviews, activity_logs)
- [x] ER diyagramı ve MySQL şeması: `docs/`

## 2. Backend (Tamamlandı ✅)
- [x] Kayıt / giriş / çıkış (Laravel Sanctum), rol tabanlı yetkilendirme (admin / müşteri)
- [x] Kitap, kategori, yazar, kullanıcı, sipariş, favori ve yorum CRUD uç noktaları
- [x] Sipariş iş kuralları: sunucu tarafı fiyat hesabı, stok kontrolü, durum akışı, iptalde stok iadesi
- [x] Soft delete (kullanıcı, kitap), activity log (işlem kayıtları)
- [x] Gelir ve satış raporları
- [x] Doğrulama, tek biçimli hata yanıtları ve doğru HTTP durum kodları
- [x] Feature testleri

## 3. Frontend (Tamamlandı ✅)
- [x] Tek noktadan API istemcisi, token yönetimi, 401'de otomatik çıkış
- [x] Müşteri: vitrin, arama, sepet, sipariş, favoriler, yorumlar, profil
- [x] Yönetici: dashboard, kitap / kullanıcı / sipariş yönetimi, raporlar, işlem kayıtları
- [x] API hatalarının kullanıcıya gösterilmesi

## 4. Teslim Öncesi (Sıradaki 📍)
- [ ] Hocanın şart listesine karşı son kontrol (uyum tablosu)
- [ ] Sunum: proje konusu ve teknoloji yığını (React + Laravel + MySQL) anlatımı
- [ ] Sunum öncesi tüm akışların baştan sona denenmesi
