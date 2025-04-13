import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions }); // ✅ pass in req

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const guardians = await prisma.guardian.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  console.log('Session:', session);
  return NextResponse.json(guardians);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions }); // ✅ pass in req

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { name, email, phone, relationship } = await req.json();

  if (!name || !email || !phone || !relationship) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const guardianCount = await prisma.guardian.count({
    where: { userId: user.id },
  });

  if (guardianCount >= 3) {
    return NextResponse.json({ error: 'Maximum number of guardians reached' }, { status: 400 });
  }

  const guardian = await prisma.guardian.create({
    data: {
      name,
      email,
      phone,
      relationship,
      userId: user.id,
      isActive: true,
    },
  });
  console.log('Session:', session);
  return NextResponse.json(guardian);
}