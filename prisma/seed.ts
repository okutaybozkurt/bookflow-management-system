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
  console.log("🗑️ Veritabanı kirletiliyor (Daha Fazla Çöp Modu)...");
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();

  // 1. Admin
  await prisma.user.upsert({
    where: { email: "admin@kitapussu.com" },
    update: {},
    create: {
      email: "admin@kitapussu.com",
      name: "KitapÜssü Admin",
      role: "ADMIN",
    },
  });

  // 2. Çöp Kategoriler
  const cat1 = await prisma.category.create({ data: { name: "asdasd_kategori" } });
  const cat2 = await prisma.category.create({ data: { name: "test_deneme_kat" } });

  // 3. Çöp Yazarlar
  const auth1 = await prisma.author.create({ data: { name: "yazar_asdsad" } });
  const auth2 = await prisma.author.create({ data: { name: "kimse_yok" } });

  // 4. Çöp Kitaplar
  const junkBooks = [
    { title: "asdsad_kitap_1", isbn: "0000", price: 1111.0, stock: 0, description: "asdsadadsad", coverImage: "https://placehold.co/400x600/red/white?text=X_HATA_X", authorId: auth1.id, categoryId: cat1.id },
    { title: "DENEME_123_TEST", isbn: "1111", price: 9999.9, stock: 999, description: "adsad", coverImage: "https://placehold.co/400x600/gray/black?text=RESIM_YOK", authorId: auth2.id, categoryId: cat2.id },
    { title: "asdsad_son_kitap", isbn: "2222", price: 1.0, stock: 1, description: "adsad", coverImage: "https://placehold.co/400x600/black/red?text=HATA", authorId: auth1.id, categoryId: cat1.id },
    { title: "GEREKSIZ_VERI_77", isbn: "3333", price: 777.7, stock: 7, description: "sil bunu sil", coverImage: "https://placehold.co/400x600/blue/white?text=BOZUK_LINK", authorId: auth2.id, categoryId: cat2.id },
    { title: "asdsad_44", isbn: "4444", price: 44.4, stock: 44, description: "adsadadsad", coverImage: "https://placehold.co/400x600/green/black?text=VERI_YOK", authorId: auth1.id, categoryId: cat1.id },
    { title: "TEST_URUNU_X", isbn: "5555", price: 0.0, stock: 0, description: "adsad", coverImage: "https://placehold.co/400x600/orange/white?text=NO_IMAGE", authorId: auth2.id, categoryId: cat2.id },
    { title: "asdsad_555", isbn: "6666", price: 555.5, stock: 5, description: "adsad", coverImage: "https://placehold.co/400x600/purple/white?text=ERR_404", authorId: auth1.id, categoryId: cat1.id },
    { title: "DENEME_KİTABI_KÖTÜ", isbn: "7777", price: 1234.5, stock: 12, description: "test test", coverImage: "https://placehold.co/400x600/pink/black?text=HATA_VAR", authorId: auth2.id, categoryId: cat2.id },
  ];

  for (const b of junkBooks) {
    await prisma.book.create({ data: b });
  }

  console.log("✅ Çöplük başarıyla genişletildi! Sunum için Kirli Mod zirvede.");
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
