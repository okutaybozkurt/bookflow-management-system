import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 401 });
    }

    // In a real app, you would hash the incoming password and compare it.
    // For this prototype, we're comparing plain text passwords.
    // Allow users without a password set (like the seeded admin) to login with any password or no password for demo purposes.
    if (user.password && user.password !== password) {
      return NextResponse.json({ error: 'Hatalı şifre.' }, { status: 401 });
    }

    // Return user info excluding password
    const { password: _, ...userInfo } = user;
    return NextResponse.json(userInfo);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}
