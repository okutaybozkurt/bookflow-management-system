import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, total, items, status = 'pending' } = await request.json();

    if (!userId || !items || !items.length) {
      return NextResponse.json({ error: 'Geçersiz sipariş verisi.' }, { status: 400 });
    }

    // Create the order and its items in a transaction
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        status,
        items: {
          create: items.map((item: any) => ({
            bookId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı kimliği gerekli.' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Siparişler getirilemedi.' }, { status: 500 });
  }
}
