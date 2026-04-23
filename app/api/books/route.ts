import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
        category: true,
      },
    });

    const transformedBooks = books.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author.name,
      price: book.price,
      stock: book.stock,
      sold: Math.floor(Math.random() * 1000), // Gerçek satış verisi henüz yok
      cover: book.coverImage || "/books/placeholder.jpg",
      isbn: book.isbn || "",
      pages: 0, // Şemada yok
      publishDate: book.createdAt.toISOString().split("T")[0],
      language: "Türkçe",
      category: book.category.name,
      description: book.description || "",
    }));

    return NextResponse.json(transformedBooks);
  } catch (error) {
    console.error("Kitaplar çekilemedi:", error);
    return NextResponse.json({ error: "Veriler yüklenemedi" }, { status: 500 });
  }
}
