import { prisma } from "@/lib/prisma";

export const GOLDEN_DATA = {
  categories: ["Dünya Klasikleri", "Yazılım", "Kişisel Gelişim", "Bilim Kurgu"],
  authors: ["George Orwell", "Robert C. Martin", "James Clear", "Ray Bradbury", "J.K. Rowling", "Yuval Noah Harari"],
  books: [
    { title: "1984", price: 45.90, stock: 120, sold: 850, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000", isbn: "9780451524935" },
    { title: "Clean Code", price: 210.00, stock: 45, sold: 320, coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000", isbn: "9780132350884" },
    { title: "Atomik Alışkanlıklar", price: 120.00, stock: 200, sold: 1200, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000", isbn: "9786052163115" },
    { title: "Fahrenheit 451", price: 65.00, stock: 85, sold: 410, coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000", isbn: "9781451673319" },
    { title: "Sapiens", price: 95.00, stock: 150, sold: 980, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000", isbn: "9786052205532" },
    { title: "Harry Potter", price: 88.00, stock: 60, sold: 1500, coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000", isbn: "9780747532743" },
    { title: "Simyacı", price: 42.00, stock: 300, sold: 2200, coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000", isbn: "9789750726439" }
  ]
};

export async function clearSystemData() {
  // Delete all books, categories and authors to ensure a completely clean state
  await prisma.book.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.author.deleteMany({});
  
  // Clear all users except the main admin
  await prisma.user.deleteMany({ where: { email: { not: "admin@kitapussu.com" } } });
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

  // Manual mapping for demo simplicity
  const bookData = [
    { ...GOLDEN_DATA.books[0], authorId: a[0].id, categoryId: c[0].id, isSystem: true },
    { ...GOLDEN_DATA.books[1], authorId: a[1].id, categoryId: c[1].id, isSystem: true },
    { ...GOLDEN_DATA.books[2], authorId: a[2].id, categoryId: c[2].id, isSystem: true },
    { ...GOLDEN_DATA.books[3], authorId: a[3].id, categoryId: c[3].id, isSystem: true },
    { ...GOLDEN_DATA.books[4], authorId: a[5].id, categoryId: c[0].id, isSystem: true },
    { ...GOLDEN_DATA.books[5], authorId: a[4].id, categoryId: c[3].id, isSystem: true },
    { ...GOLDEN_DATA.books[6], authorId: a[2].id, categoryId: c[2].id, isSystem: true },
  ];

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
