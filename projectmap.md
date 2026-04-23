# 🗺️ KitapÜssü Roadmap

Bu dosya projenin mutfağındaki iş listesidir.

---

## 1. Aşama: Temeller ve UI/UX (Tamamlandı ✅)
- [x] KitapÜssü marka kimliğinin oluşturulması (Siyah-Turuncu-Beyaz).
- [x] v0 ile profesyonel frontend prototipinin (Trendyol/Hepsiburada stili) hazırlanması.
- [x] GitHub reposunun kurulumu ve ana kodların pushlanması.
- [x] Temel sayfa yapılarının (Müşteri, Admin, Kitap Detay) oluşturulması.

---

## 2. Aşama: Backend ve Veri Mimarisi (Tamamlandı ✅)
- [x] Backend Teknolojisi Seçimi: Next.js API Handlers + Prisma + SQLite.
- [x] Veritabanı Tasarımı: Kitaplar, Kategoriler, Yazarlar ve Kullanıcılar modelleri kuruldu.
- [x] Auth (Yetkilendirme): Admin ve User rolleri şemaya eklendi.
- [x] Dinamik Veri Akışı: Kitap verileri veritabanından çekilmeye başlandı.

---

## 3. Aşama: "Admin Reset" ve Mühendislik Dokunuşları (Şu An Buradayız 📍)
- [x] Sunum Modu (Reset Mechanism): /api/admin/reset endpoint'i hazırlandı.
- [x] Seeder Yapılandırması: prisma/seed.ts ile Altın Veri (Golden Data) kurgulandı.
- [x] Kısayol Entegrasyonu: Ctrl + Shift + R kısayolu ile sistem anında sıfırlanabiliyor.

---

## 4. Aşama: CRUD ve Fonksiyonellik (Final 🏁)
- [ ] Admin panelinde kitap ekleme, silme ve düzenleme işlemlerinin veritabanı ile senkronize edilmesi.
- [ ] Gelir/Gider grafiklerinin gerçek satış verilerinden beslenmesi.
- [ ] Final testleri ve hocaya sunum provası.
