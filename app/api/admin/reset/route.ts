import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { mode } = await request.json();

    console.log(`🔄 Reset: ${mode} modu hazırlanıyor...`);

    await prisma.book.deleteMany();
    await prisma.category.deleteMany();
    await prisma.author.deleteMany();
    await prisma.user.deleteMany({ where: { email: { not: "admin@kitapussu.com" } } });

    if (mode === 'junk') {
      const cat = await prisma.category.create({ data: { name: "ASDASD_KAT_99" } });
      const auth = await prisma.author.create({ data: { name: "adsad_yazar" } });
      const junkBooks = Array.from({ length: 10 }).map((_, i) => ({
        title: `ASDASD_KITAP_${i}999`,
        isbn: `${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}${i}`,
        price: Math.random() > 0.5 ? 99999 : 0.01,
        stock: Math.random() > 0.5 ? 9999 : 0,
        coverImage: `https://placehold.co/400x600/${i % 2 === 0 ? 'red' : 'gray'}/white?text=X_HATA_X`,
        authorId: auth.id, categoryId: cat.id
      }));
      for (const b of junkBooks) await prisma.book.create({ data: b });
      return NextResponse.json({ success: true });
    } else {
      const cats = ["Dünya Klasikleri", "Yazılım", "Kişisel Gelişim", "Bilim Kurgu"];
      const auts = ["George Orwell", "Robert C. Martin", "James Clear", "Ray Bradbury", "J.K. Rowling", "Yuval Noah Harari"];

      const c = await Promise.all(cats.map(name => prisma.category.create({ data: { name } })));
      const a = await Promise.all(auts.map(name => prisma.author.create({ data: { name } })));

      const books = [
        { title: "1984", price: 45.90, stock: 120, coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000", authorId: a[0].id, categoryId: c[0].id, isbn: "9780451524935" },
        { title: "Clean Code", price: 210.00, stock: 45, coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000", authorId: a[1].id, categoryId: c[1].id, isbn: "9780132350884" },
        { title: "Atomik Alışkanlıklar", price: 120.00, stock: 200, coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000", authorId: a[2].id, categoryId: c[2].id, isbn: "9786052163115" },
        { title: "Fahrenheit 451", price: 65.00, stock: 85, coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000", authorId: a[3].id, categoryId: c[3].id, isbn: "9781451673319" },
        { title: "Sapiens", price: 95.00, stock: 150, coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000", authorId: a[5].id, categoryId: c[0].id, isbn: "9786052205532" },
        { title: "Harry Potter", price: 88.00, stock: 60, coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000", authorId: a[4].id, categoryId: c[3].id, isbn: "9780747532743" },
        { title: "Simyacı", price: 42.00, stock: 300, coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000", authorId: a[2].id, categoryId: c[2].id, isbn: "9789750726439" }
      ];

      for (const b of books) await prisma.book.create({ data: b });
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    console.error("Reset Hatası:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
