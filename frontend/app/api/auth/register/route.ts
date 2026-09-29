import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre zorunludur' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Bu email adresi zaten kullanımda' }, { status: 409 });
    }

    // Create the user
    // Note: In a real production app, password should be hashed (e.g. bcrypt).
    // Storing as plain text here for prototype/demo consistency.
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        name,
        role: 'USER',
      },
    });

    // Remove password before sending to client
    const { password: _, ...userInfo } = newUser;

    return NextResponse.json(userInfo, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Kayıt olurken bir hata oluştu' }, { status: 500 });
  }
}
