import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Session:', session); // Debug log
    
    if (!session?.user?.email) {
      console.log('No session or email found'); // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Update data:', data); // Debug log

    // First, find the user to ensure they exist
    const existingUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!existingUser) {
      console.log('User not found'); // Debug log
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: existingUser.id, // Use the user's ID instead of email
      },
      data: {
        name: data.name || null,
        imageUrl: data.imageUrl || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        imageUrl: true,
      },
    });

    console.log('Updated user:', updatedUser); // Debug log
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 