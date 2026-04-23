// BookFlow Data Store
// Supports "golden" (realistic) and "junk" (test) data modes

export type DataMode = 'golden' | 'junk'

export interface Book {
  id: string
  title: string
  author: string
  price: number
  stock: number
  sold: number
  cover: string
  isbn: string
  pages: number
  publishDate: string
  language: string
  category: string
  description: string
  isFavorited?: boolean
}

export interface Order {
  id: string
  customer: string
  date: string
  amount: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  items: number
}

export interface RevenueEntry {
  month: string
  gelir: number
  gider: number
}

export interface YearlyEntry {
  year: string
  gelir: number
  gider: number
}

// ──────────────────────────────────────────────
// GOLDEN DATA (Realistic / Presentation Mode)
// ──────────────────────────────────────────────
export const goldenBooks: Book[] = [
  {
    id: '1',
    title: 'Kaybolan Şehir',
    author: 'Ahmet Altan',
    price: 189.90,
    stock: 142,
    sold: 3847,
    cover: '/books/book1.jpg',
    isbn: '978-975-123-456-7',
    pages: 342,
    publishDate: '2023-03-15',
    language: 'Türkçe',
    category: 'Roman',
    description: 'İstanbul\'un gizemli sokaklarında geçen, unutulmaz bir aşk ve kayıp hikayesi.',
    isFavorited: false,
  },
  {
    id: '2',
    title: 'Sessiz Fırtına',
    author: 'Elif Şafak',
    price: 215.00,
    stock: 87,
    sold: 5201,
    cover: '/books/book2.jpg',
    isbn: '978-975-234-567-8',
    pages: 418,
    publishDate: '2023-07-22',
    language: 'Türkçe',
    category: 'Roman',
    description: 'Doğu ve Batı\'nın kesiştiği noktada, iki farklı dünyanın çarpışma anı.',
    isFavorited: true,
  },
  {
    id: '3',
    title: 'Kuantum Dünyası',
    author: 'Prof. Dr. Mustafa Erdoğan',
    price: 249.50,
    stock: 203,
    sold: 2134,
    cover: '/books/book3.jpg',
    isbn: '978-975-345-678-9',
    pages: 576,
    publishDate: '2022-11-08',
    language: 'Türkçe',
    category: 'Bilim',
    description: 'Kuantum fiziğinin temellerini herkesin anlayabileceği bir dille anlatan kapsamlı rehber.',
    isFavorited: false,
  },
  {
    id: '4',
    title: 'Aşkın Rengi',
    author: 'Zülfü Livaneli',
    price: 167.00,
    stock: 318,
    sold: 7890,
    cover: '/books/book4.jpg',
    isbn: '978-975-456-789-0',
    pages: 284,
    publishDate: '2024-01-12',
    language: 'Türkçe',
    category: 'Roman',
    description: 'Anadolu topraklarında filizlenen ve nesiller boyu süren bir aşkın destansı hikayesi.',
    isFavorited: false,
  },
  {
    id: '5',
    title: 'Başarı Formülü',
    author: 'Mehmet Yılmaz',
    price: 129.90,
    stock: 456,
    sold: 4523,
    cover: '/books/book5.jpg',
    isbn: '978-975-567-890-1',
    pages: 238,
    publishDate: '2023-09-30',
    language: 'Türkçe',
    category: 'Kişisel Gelişim',
    description: 'Türk iş dünyasının önde gelen isimleriyle gerçekleştirilen röportajlardan derlenen başarı sırları.',
    isFavorited: false,
  },
  {
    id: '6',
    title: 'Büyülü Orman',
    author: 'Ayşe Kulin',
    price: 198.00,
    stock: 175,
    sold: 6102,
    cover: '/books/book6.jpg',
    isbn: '978-975-678-901-2',
    pages: 392,
    publishDate: '2023-05-18',
    language: 'Türkçe',
    category: 'Fantastik',
    description: 'Gizemli bir ormanın derinliklerinde kaybolan bir çocuğun büyüleyici macera yolculuğu.',
    isFavorited: true,
  },
  // Fantastik
  {
    id: '7',
    title: 'Ejderha Yemini',
    author: 'Barış Müstecaplıoğlu',
    price: 224.00,
    stock: 98,
    sold: 3210,
    cover: '/books/fantastik1.jpg',
    isbn: '978-975-789-012-3',
    pages: 512,
    publishDate: '2023-08-01',
    language: 'Türkçe',
    category: 'Fantastik',
    description: 'Ejderhalar ile insanların savaştığı efsanevi bir dünyada bir savaşçının yemini ve kaderi.',
    isFavorited: false,
  },
  // Ansiklopedi
  {
    id: '8',
    title: 'Dünya Ansiklopedisi',
    author: 'Kollektif',
    price: 449.90,
    stock: 310,
    sold: 1890,
    cover: '/books/ansiklopedi1.jpg',
    isbn: '978-975-890-123-4',
    pages: 1200,
    publishDate: '2022-09-10',
    language: 'Türkçe',
    category: 'Ansiklopedi',
    description: 'Dünya coğrafyası, tarihi, kültürleri ve doğal yaşamına dair kapsamlı ansiklopedik başvuru kaynağı.',
    isFavorited: false,
  },
  {
    id: '9',
    title: 'Bilim Ansiklopedisi',
    author: 'Prof. Dr. Ali Demir',
    price: 389.50,
    stock: 215,
    sold: 1420,
    cover: '/books/ansiklopedi2.jpg',
    isbn: '978-975-901-234-5',
    pages: 980,
    publishDate: '2023-02-14',
    language: 'Türkçe',
    category: 'Ansiklopedi',
    description: 'Fizik, kimya, biyoloji ve astronomi alanlarını kapsayan görsel ağırlıklı bilim ansiklopedisi.',
    isFavorited: false,
  },
  // KPSS
  {
    id: '10',
    title: 'KPSS 2024 Hazırlık',
    author: 'Ahmet Kaya & Ekip',
    price: 159.00,
    stock: 520,
    sold: 8740,
    cover: '/books/kpss1.jpg',
    isbn: '978-975-012-345-6',
    pages: 640,
    publishDate: '2024-01-20',
    language: 'Türkçe',
    category: 'KPSS',
    description: '2024 KPSS sınavına hazırlık için güncel müfredat, çözümlü sorular ve deneme sınavları.',
    isFavorited: false,
  },
  {
    id: '11',
    title: 'KPSS Matematik',
    author: 'Metin Özgür',
    price: 139.90,
    stock: 380,
    sold: 6230,
    cover: '/books/kpss2.jpg',
    isbn: '978-975-123-456-8',
    pages: 480,
    publishDate: '2024-02-05',
    language: 'Türkçe',
    category: 'KPSS',
    description: 'KPSS Genel Yetenek bölümü için tüm matematik konularını kapsayan soru bankası ve çözümler.',
    isFavorited: false,
  },
  // Çocuk
  {
    id: '12',
    title: 'Tilki ile Tavşan',
    author: 'Seda Çelik',
    price: 89.90,
    stock: 290,
    sold: 5670,
    cover: '/books/cocuk1.jpg',
    isbn: '978-975-234-567-9',
    pages: 48,
    publishDate: '2023-04-12',
    language: 'Türkçe',
    category: 'Çocuk',
    description: 'Ormanın kurnaz tilkisi ile akıllı tavşanın renkli maceralarını anlatan çocuklar için resimli hikaye.',
    isFavorited: false,
  },
  {
    id: '13',
    title: 'Uzay Macerası',
    author: 'Ozan Doğru',
    price: 79.50,
    stock: 340,
    sold: 4880,
    cover: '/books/cocuk2.jpg',
    isbn: '978-975-345-678-0',
    pages: 64,
    publishDate: '2023-06-30',
    language: 'Türkçe',
    category: 'Çocuk',
    description: 'Minik astronot Mavi\'nin Mars\'a yolculuğunu anlatan renkli çizgilerle dolu eğlenceli uzay macerası.',
    isFavorited: false,
  },
  // Tarih
  {
    id: '14',
    title: "Osmanlı'nın Son Günleri",
    author: 'İlber Ortaylı',
    price: 235.00,
    stock: 178,
    sold: 7120,
    cover: '/books/tarih1.jpg',
    isbn: '978-975-456-789-1',
    pages: 428,
    publishDate: '2022-10-22',
    language: 'Türkçe',
    category: 'Tarih',
    description: "Osmanlı İmparatorluğu'nun son döneminde yaşanan siyasi çalkantılar ve imparatorluğun çöküşünün perde arkası.",
    isFavorited: false,
  },
  {
    id: '15',
    title: 'Dünya Tarihi',
    author: 'Haluk Şahin',
    price: 279.90,
    stock: 142,
    sold: 3450,
    cover: '/books/tarih2.jpg',
    isbn: '978-975-567-890-2',
    pages: 756,
    publishDate: '2023-01-08',
    language: 'Türkçe',
    category: 'Tarih',
    description: 'Antik çağlardan günümüze uzanan insanlık tarihini haritalar ve görseller eşliğinde anlatan kapsamlı bir rehber.',
    isFavorited: false,
  },
  // Felsefe
  {
    id: '16',
    title: 'Varlık ve Hiçlik',
    author: 'Doç. Dr. Leyla Saraç',
    price: 189.00,
    stock: 95,
    sold: 2340,
    cover: '/books/felsefe1.jpg',
    isbn: '978-975-678-901-3',
    pages: 320,
    publishDate: '2023-11-01',
    language: 'Türkçe',
    category: 'Felsefe',
    description: "Sartre'ın varoluşçuluğunu Türk okuyucuya özgün bir perspektifle aktaran felsefi inceleme.",
    isFavorited: false,
  },
  {
    id: '17',
    title: "Sokrates'in İzinde",
    author: 'Adnan Gürbüz',
    price: 159.90,
    stock: 120,
    sold: 1980,
    cover: '/books/felsefe2.jpg',
    isbn: '978-975-789-012-4',
    pages: 268,
    publishDate: '2022-07-15',
    language: 'Türkçe',
    category: 'Felsefe',
    description: 'Antik Yunan düşüncesinin doruklarına çıkan Sokrates, Platon ve Aristoteles üzerine sade ve akıcı bir inceleme.',
    isFavorited: false,
  },
  // Kişisel Gelişim
  {
    id: '18',
    title: 'Zihin Devrimi',
    author: 'Caner Taşlı',
    price: 144.90,
    stock: 415,
    sold: 9120,
    cover: '/books/gelisim1.jpg',
    isbn: '978-975-890-123-5',
    pages: 256,
    publishDate: '2024-03-01',
    language: 'Türkçe',
    category: 'Kişisel Gelişim',
    description: 'Beyin nöroplastisitesine dayanan pratik egzersizler ile alışkanlıklarınızı ve düşünce kalıplarınızı dönüştürün.',
    isFavorited: false,
  },
]

export const goldenMonthlyRevenue: RevenueEntry[] = [
  { month: 'Oca', gelir: 128500, gider: 74200 },
  { month: 'Şub', gelir: 142300, gider: 81500 },
  { month: 'Mar', gelir: 168900, gider: 92300 },
  { month: 'Nis', gelir: 195400, gider: 107800 },
  { month: 'May', gelir: 221700, gider: 118600 },
  { month: 'Haz', gelir: 187300, gider: 99400 },
  { month: 'Tem', gelir: 203600, gider: 108200 },
  { month: 'Ağu', gelir: 215800, gider: 115700 },
  { month: 'Eyl', gelir: 231400, gider: 123900 },
  { month: 'Eki', gelir: 268900, gider: 142100 },
  { month: 'Kas', gelir: 312500, gider: 168400 },
  { month: 'Ara', gelir: 387200, gider: 198700 },
]

export const goldenYearlyRevenue: YearlyEntry[] = [
  { year: '2021', gelir: 1420000, gider: 820000 },
  { year: '2022', gelir: 1890000, gider: 1050000 },
  { year: '2023', gelir: 2480000, gider: 1320000 },
  { year: '2024', gelir: 2863500, gider: 1530600 },
]

export const goldenMetrics = {
  toplamKitap: 1847,
  toplamGelir: 2863500,
  toplamStok: 28450,
}

// ──────────────────────────────────────────────
// JUNK DATA (Test / Development Mode)
// ──────────────────────────────────────────────
export const junkBooks: Book[] = [
  {
    id: 'j1',
    title: 'asdasd kitap',
    author: 'asdasd yazar',
    price: 9999,
    stock: 0,
    sold: 1,
    cover: '/books/book1.jpg',
    isbn: '000-000-000-000',
    pages: 1,
    publishDate: '2000-01-01',
    language: 'unknown',
    category: 'test',
    description: 'lorem ipsum dolor sit amet asdasdasd test data',
    isFavorited: false,
  },
  {
    id: 'j2',
    title: 'TEST BOOK 2',
    author: 'test author 123',
    price: 0.01,
    stock: 99999,
    sold: 0,
    cover: '/books/book2.jpg',
    isbn: '111-111-111-111',
    pages: 9999,
    publishDate: '1900-12-31',
    language: 'tr',
    category: 'asdfgh',
    description: 'aaaaaaaaa bbbbbbbbb cccccccccc test test test',
    isFavorited: false,
  },
  {
    id: 'j3',
    title: 'zzz zzz zzz',
    author: 'Null Null',
    price: 1,
    stock: 1,
    sold: 999,
    cover: '/books/book3.jpg',
    isbn: '???-???-???-???',
    pages: 0,
    publishDate: '2099-01-01',
    language: 'qwerty',
    category: 'undefined',
    description: 'undefined undefined null null NaN',
    isFavorited: false,
  },
  {
    id: 'j4',
    title: 'qqqqqq wwwwww eeee',
    author: 'Foo Bar',
    price: 123456,
    stock: 3,
    sold: 0,
    cover: '/books/book4.jpg',
    isbn: 'INVALID',
    pages: 10000,
    publishDate: '2000-00-00',
    language: '---',
    category: '!@#$%',
    description: '!!! $$$ *** test junk data entry for dev mode',
    isFavorited: false,
  },
]

export const junkMonthlyRevenue: RevenueEntry[] = [
  { month: 'aaa', gelir: 1, gider: 99999 },
  { month: 'bbb', gelir: 999999, gider: 1 },
  { month: 'ccc', gelir: 0, gider: 0 },
  { month: 'ddd', gelir: 123, gider: 456789 },
  { month: 'eee', gelir: 11111, gider: 22222 },
  { month: 'fff', gelir: 9, gider: 99 },
]

export const junkYearlyRevenue: YearlyEntry[] = [
  { year: '0001', gelir: 999999, gider: 1 },
  { year: '9999', gelir: 0, gider: 999999 },
]

export const junkMetrics = {
  toplamKitap: 0,
  toplamGelir: 9999999,
  toplamStok: -1,
}

// ──────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────
export const categories = [
  { label: 'Kitap', emoji: '📚', icon: 'BookOpen' },
  { label: 'Ansiklopedi', emoji: '🌍', icon: 'Globe' },
  { label: 'Roman', emoji: '📖', icon: 'BookMarked' },
  { label: 'Bilim', emoji: '🔬', icon: 'Microscope' },
  { label: 'KPSS', emoji: '🎓', icon: 'GraduationCap' },
  { label: 'Çocuk', emoji: '🧸', icon: 'Baby' },
  { label: 'Tarih', emoji: '🏛️', icon: 'Landmark' },
  { label: 'Felsefe', emoji: '🤔', icon: 'Brain' },
  { label: 'Kişisel Gelişim', emoji: '💡', icon: 'Lightbulb' },
  { label: 'Fantastik', emoji: '🧙', icon: 'Wand2' },
]
