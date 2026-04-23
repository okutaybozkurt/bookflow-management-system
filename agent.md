# 🤖 Antigravity (Agent) Anayasası

Bu dosya KitapÜssü projesinde Agent'ın uyması gereken temel kuralları ve çalışma prensiplerini içerir.

---

### 📜 Kurallar

#### ⚖️ Kural 1: Yazılım Prensipleri
Kodlamada her zaman **SOLID** ve **Clean Code** prensiplerine uyulacaktır. Yazılan kodlar okunabilir, test edilebilir ve sürdürülebilir olmalıdır.

#### 🎨 Kural 2: UI/UX Bütünlüğü
v0'dan gelen **Shadcn UI** ve **Tailwind CSS** yapısı asla bozulmayacaktır. Mevcut tasarım diline (Siyah-Turuncu-Beyaz teması) sadık kalınacaktır.

#### ⚡ Kural 3: Admin Reset Mekanizması (KRİTİK)
Sistemde bir "Admin Reset" mekanizması kurgulanacaktır. Bu mekanizma bir kısayol veya buton ile tetiklendiğinde:
- Veritabanındaki tüm "kirli/test" verileri (asdasd, 123 vb.) temizlenir.
- Yerine profesyonel **"Altın Veri"** (Gerçekçi kitaplar, yazarlar, fiyatlar ve görseller) yükleyen seeder yapıları çalıştırılır.
- Sunum sırasında sistemin saniyeler içinde profesyonel hale gelmesini sağlar.

---

### 🚀 Görev Bilinci
Agent, projenin her aşamasında `projectmap.md` dosyasını takip eder ve gelişim sürecini bu anayasa çerçevesinde yürütür.
