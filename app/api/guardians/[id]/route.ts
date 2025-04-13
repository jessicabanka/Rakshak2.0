import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const guardian = await prisma.guardian.findUnique({
      where: { id: params.id },
    });
    
    if (!guardian) {
      return NextResponse.json({ error: 'Guardian not found' }, { status: 404 });
    }
    
    if (guardian.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, email, phone, relationship } = await request.json();
    
    if (!name || !email || !phone || !relationship) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const updatedGuardian = await prisma.guardian.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        relationship,
      },
    });
    
    return NextResponse.json(updatedGuardian);
  } catch (error) {
    console.error('Error updating guardian:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const guardian = await prisma.guardian.findUnique({
      where: { id: params.id },
    });
    
    if (!guardian) {
      return NextResponse.json({ error: 'Guardian not found' }, { status: 404 });
    }
    
    if (guardian.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await prisma.guardian.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guardian:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 