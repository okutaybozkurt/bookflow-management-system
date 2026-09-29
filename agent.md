# 🤖 BookFlow Geliştirme Kuralları

Bu dosya projede çalışan geliştirici ve yapay zekâ asistanlarının uyması gereken kuralları içerir.

---

### 📜 Kurallar

#### ⚖️ Kural 1: Yazılım Prensipleri
Kodlamada **SOLID** ve **Clean Code** prensiplerine uyulur. Controller'da iş kuralı olmaz; iş mantığı `Services` katmanında, doğrulama `Form Request`'lerde, çıktı biçimi `Resource`'larda bulunur. Ayrıntı: `docs/MIMARI.md`.

#### 🎨 Kural 2: UI/UX Bütünlüğü
**Shadcn UI** ve **Tailwind CSS** yapısı bozulmaz; mevcut tasarım diline (Siyah-Turuncu-Beyaz tema) sadık kalınır.

#### ✅ Kural 3: Her Özellik Gerçekten Çalışır
Ekranı olup arkasında backend işlemi bulunmayan özellik eklenmez. Ekleme, silme, güncelleme ve giriş işlemleri Laravel API üzerinden veritabanına yazılır. Sahte (mock/statik) veri ve işlevsiz buton bırakılmaz.

#### 🔒 Kural 4: İş Kuralları ve Güvenlik Backend'dedir
Fiyat, stok, yetki ve durum geçişi kontrolleri yalnızca backend'de yapılır; frontend'e güvenilmez. Şifreler hash'lenir, `.env` dosyası Git'e gönderilmez.

#### 🧪 Kural 5: Test
Backend'deki her iş kuralı için feature test yazılır (`php artisan test`). Commit'lemeden önce testler geçmelidir.

---

### 🚀 Görev Bilinci
Kurulum ve API uç noktaları için kökteki `README.md`, veritabanı için `docs/ER-DIYAGRAMI.md` esas alınır. Yapılacaklar `projectmap.md` dosyasındadır.
