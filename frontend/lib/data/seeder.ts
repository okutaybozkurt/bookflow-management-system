import { prisma } from "@/lib/prisma";

export const GOLDEN_DATA = {
  categories: ["Dünya Klasikleri", "Yazılım", "Kişisel Gelişim", "Bilim Kurgu", "Tarih", "Psikoloji", "Felsefe", "Biyografi", "Bilim"],
  authors: [
    "George Orwell", "Robert C. Martin", "James Clear", "Ray Bradbury", 
    "J.K. Rowling", "Yuval Noah Harari", "Paulo Coelho", "İlber Ortaylı", 
    "Viktor E. Frankl", "Friedrich Nietzsche", "Walter Isaacson", "Stefan Zweig", 
    "Sabahattin Ali", "Fyodor Dostoyevski", "Carl Sagan"
  ],
  books: [
    // 1
    { title: "1984", price: 45.90, stock: 120, sold: 850, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000", isbn: "9780451524935", authorIndex: 0, categoryIndex: 3 },
    // 2
    { title: "Clean Code", price: 210.00, stock: 45, sold: 320, coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000", isbn: "9780132350884", authorIndex: 1, categoryIndex: 1 },
    // 3
    { title: "Atomik Alışkanlıklar", price: 120.00, stock: 200, sold: 1200, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000", isbn: "9786052163115", authorIndex: 2, categoryIndex: 2 },
    // 4
    { title: "Fahrenheit 451", price: 65.00, stock: 85, sold: 410, coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000", isbn: "9781451673319", authorIndex: 3, categoryIndex: 3 },
    // 5
    { title: "Sapiens", price: 95.00, stock: 150, sold: 980, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000", isbn: "9786052205532", authorIndex: 5, categoryIndex: 4 },
    // 6
    { title: "Harry Potter", price: 88.00, stock: 60, sold: 1500, coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000", isbn: "9780747532743", authorIndex: 4, categoryIndex: 3 },
    // 7
    { title: "Simyacı", price: 42.00, stock: 300, sold: 2200, coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000", isbn: "9789750726439", authorIndex: 6, categoryIndex: 0 },
    // 8
    { title: "Bir Ömür Nasıl Yaşanır?", price: 55.00, stock: 180, sold: 950, coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000", isbn: "9786057635836", authorIndex: 7, categoryIndex: 4 },
    // 9
    { title: "İnsanın Anlam Arayışı", price: 48.00, stock: 250, sold: 1400, coverImage: "https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=1000", isbn: "9789755395269", authorIndex: 8, categoryIndex: 5 },
    // 10
    { title: "Böyle Söyledi Zerdüşt", price: 60.00, stock: 110, sold: 670, coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000", isbn: "9786053606116", authorIndex: 9, categoryIndex: 6 },
    // 11
    { title: "Steve Jobs", price: 135.00, stock: 90, sold: 540, coverImage: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1000", isbn: "9786050904444", authorIndex: 10, categoryIndex: 7 },
    // 12
    { title: "Satranç", price: 25.00, stock: 400, sold: 3500, coverImage: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000", isbn: "9786053606115", authorIndex: 11, categoryIndex: 0 },
    // 13
    { title: "Kürk Mantolu Madonna", price: 35.00, stock: 500, sold: 4200, coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000", isbn: "9789753638029", authorIndex: 12, categoryIndex: 0 },
    // 14
    { title: "Suç ve Ceza", price: 75.00, stock: 140, sold: 1100, coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000", isbn: "9789750719387", authorIndex: 13, categoryIndex: 0 },
    // 15
    { title: "Kozmos", price: 115.00, stock: 75, sold: 480, coverImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000", isbn: "9789752115118", authorIndex: 14, categoryIndex: 8 }
  ]
};

export async function clearSystemData() {
  // Clear orders first to prevent foreign key constraint violations
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  // Delete all books, categories and authors to ensure a completely clean state
  await prisma.book.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.author.deleteMany({});
  
  // Kullanıcıları (users) silmiyoruz, böylece demoda kayıt olan kişiler hesaplarını kaybetmez.
}

export async function seedGoldenData() {
  const c = await Promise.all(GOLDEN_DATA.categories.map(name => 
    prisma.category.upsert({
      where: { name },
      update: { isSystem: true },
      create: { name, isSystem: true }
    })
  ));

  const a = await Promise.all(GOLDEN_DATA.authors.map(name => 
    prisma.author.upsert({
      where: { name },
      update: { isSystem: true },
      create: { name, isSystem: true }
    })
  ));

  const bookData = GOLDEN_DATA.books.map(b => ({
    title: b.title,
    price: b.price,
    stock: b.stock,
    sold: b.sold,
    coverImage: b.coverImage,
    isbn: b.isbn,
    authorId: a[b.authorIndex].id,
    categoryId: c[b.categoryIndex].id,
    isSystem: true
  }));

  for (const b of bookData) await prisma.book.create({ data: b });
}

export async function seedJunkData() {
  const cat = await prisma.category.upsert({
    where: { name: "ASDASD_KAT_99" },
    update: { isSystem: true },
    create: { name: "ASDASD_KAT_99", isSystem: true }
  });
  const auth = await prisma.author.upsert({
    where: { name: "adsad_yazar" },
    update: { isSystem: true },
    create: { name: "adsad_yazar", isSystem: true }
  });

  const junkBooks = Array.from({ length: 10 }).map((_, i) => ({
    title: `ASDASD_KITAP_${i}999`,
    isbn: `JUNK${i}${Date.now()}`,
    price: Math.random() > 0.5 ? 99999 : 0.01,
    stock: Math.random() > 0.5 ? 9999 : 0,
    sold: i % 2 === 0 ? 111 : 999,
    coverImage: `https://placehold.co/400x600/${i % 2 === 0 ? 'red' : 'gray'}/white?text=X_HATA_X`,
    authorId: auth.id, categoryId: cat.id, isSystem: true
  }));

  for (const b of junkBooks) await prisma.book.create({ data: b });
}
