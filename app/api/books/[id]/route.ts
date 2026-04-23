import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, author, price, stock, category, cover, description, isbn } = body;

    if (!id || id === 'undefined') {
      return NextResponse.json({ error: "Kitap ID'si bulunamadı." }, { status: 400 });
    }

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock);

    if (isNaN(numPrice) || isNaN(numStock)) {
      return NextResponse.json({ error: "Geçersiz fiyat veya stok." }, { status: 400 });
    }

    // Kategori ve Yazar kontrolü
    const dbCategory = await prisma.category.findFirst({ where: { name: category } }) || 
                       await prisma.category.create({ data: { name: category } });

    const dbAuthor = await prisma.author.findFirst({ where: { name: author } }) || 
                     await prisma.author.create({ data: { name: author } });

    const updatedBook = await prisma.book.update({
      where: { id },
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

    return NextResponse.json(updatedBook);
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.book.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
