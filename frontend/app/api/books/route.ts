import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: { author: true, category: true },
      orderBy: { createdAt: "desc" },
    });

    const formattedBooks = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author.name,
      category: book.category.name,
      price: book.price,
      stock: book.stock,
      sold: book.sold,
      cover: book.coverImage || "",
      description: book.description || "",
      isbn: book.isbn || "",
    }));

    return NextResponse.json(formattedBooks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, price, stock, category, cover, description, isbn } = body;

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock);

    if (isNaN(numPrice) || isNaN(numStock)) {
      return NextResponse.json({ error: "Fiyat ve Stok geçerli bir sayı olmalıdır." }, { status: 400 });
    }

    if (!title || !author || !category) {
      return NextResponse.json({ error: "Başlık, Yazar ve Kategori alanları zorunludur." }, { status: 400 });
    }

    const dbCategory = await prisma.category.findFirst({ where: { name: category } }) ||
      await prisma.category.create({ data: { name: category } });

    const dbAuthor = await prisma.author.findFirst({ where: { name: author } }) ||
      await prisma.author.create({ data: { name: author } });

    const existingBook = isbn ? await prisma.book.findFirst({ where: { isbn } }) : null;

    if (existingBook) {
      return NextResponse.json({ error: "Bu ISBN numarasına sahip bir kitap zaten mevcut." }, { status: 400 });
    }

    const newBook = await prisma.book.create({
      data: {
        title,
        price: numPrice,
        stock: numStock,
        isbn: isbn || null,
        description: description || "",
        coverImage: cover || "",
        authorId: dbAuthor.id,
        categoryId: dbCategory.id,
      },
    });

    return NextResponse.json(newBook);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
