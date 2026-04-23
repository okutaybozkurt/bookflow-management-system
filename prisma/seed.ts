import { PrismaClient, Author, Category } from "@/lib/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import "dotenv/config";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "password",
  database: process.env.DATABASE_NAME || "kitapussu",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Veritabanı temizleniyor...");
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();

  console.log("🚀 Altın Veri (Golden Data) yükleniyor...");

  // 1. Admin Kullanıcısı
  await prisma.user.upsert({
    where: { email: "admin@kitapussu.com" },
    update: {},
    create: {
      email: "admin@kitapussu.com",
      name: "KitapÜssü Admin",
      role: "ADMIN",
    },
  });

  // 2. Kategoriler
  const categories = [
    { name: "Dünya Klasikleri" },
    { name: "Bilim Kurgu & Distopya" },
    { name: "Fantastik" },
    { name: "Yazılım & Teknoloji" },
    { name: "Kişisel Gelişim" },
  ];

  const createdCategories = await Promise.all(
    categories.map((c) =>
      prisma.category.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      })
    )
  );

  // 3. Yazarlar
  const authors = [
    { name: "George Orwell" },
    { name: "J.R.R. Tolkien" },
    { name: "Robert C. Martin" },
    { name: "Paulo Coelho" },
    { name: "F. Scott Fitzgerald" },
  ];

  const createdAuthors = await Promise.all(
    authors.map((a) =>
      prisma.author.create({
        data: a,
      })
    )
  );

  // 4. Kitaplar
  const books = [
    {
      title: "1984",
      isbn: "9780451524935",
      price: 45.90,
      stock: 120,
      description: "Büyük Birader seni izliyor.",
      coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop",
      authorId: createdAuthors.find((a: Author) => a.name === "George Orwell")!.id,
      categoryId: createdCategories.find((c: Category) => c.name === "Bilim Kurgu & Distopya")!.id,
    },
    {
      title: "Hobbit",
      isbn: "9780547928227",
      price: 89.00,
      stock: 50,
      description: "Bilbo Baggins'in beklenmedik yolculuğu.",
      coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?q=80&w=1000&auto=format&fit=crop",
      authorId: createdAuthors.find((a: Author) => a.name === "J.R.R. Tolkien")!.id,
      categoryId: createdCategories.find((c: Category) => c.name === "Fantastik")!.id,
    },
    {
      title: "Clean Code",
      isbn: "9780132350884",
      price: 150.00,
      stock: 30,
      description: "Sürdürülebilir yazılım için altın kurallar.",
      coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000&auto=format&fit=crop",
      authorId: createdAuthors.find((a: Author) => a.name === "Robert C. Martin")!.id,
      categoryId: createdCategories.find((c: Category) => c.name === "Yazılım & Teknoloji")!.id,
    },
    {
      title: "Simyacı",
      isbn: "9780062315007",
      price: 35.00,
      stock: 200,
      description: "Kendi kişisel menkıbeni bul.",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
      authorId: createdAuthors.find((a: Author) => a.name === "Paulo Coelho")!.id,
      categoryId: createdCategories.find((c: Category) => c.name === "Kişisel Gelişim")!.id,
    },
    {
      title: "Muhteşem Gatsby",
      isbn: "9780743273565",
      price: 42.00,
      stock: 75,
      description: "Caz çağının parıltısı ve trajedisi.",
      coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
      authorId: createdAuthors.find((a: Author) => a.name === "F. Scott Fitzgerald")!.id,
      categoryId: createdCategories.find((c: Category) => c.name === "Dünya Klasikleri")!.id,
    },
  ];

  await Promise.all(
    books.map((b) =>
      prisma.book.create({
        data: b,
      })
    )
  );

  console.log("✅ Altın Veri başarıyla yüklendi!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
