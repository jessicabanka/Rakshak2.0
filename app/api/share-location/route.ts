// app/api/share-location/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Update this path to your actual authOptions location
import prisma from '@/lib/prisma'; // Update this path to your Prisma client
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { latitude, longitude } = body;

  try {
    // Step 1: Get current user & their guardians
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { guardians: true }, // assumes you have a guardians relation
    });

    if (!user || !user.guardians?.length) {
      return NextResponse.json({ error: 'No guardians found' }, { status: 404 });
    }

    // Step 2: Send location SMS to all guardians
    await Promise.all(
      user.guardians.map((guardian) =>
        client.messages.create({
          body: `Your guardian's current location is: https://www.google.com/maps?q=${latitude},${longitude}`,
          from: process.env.TWILIO_PHONE_NUMBER!,
          to: guardian.phone,
        })
      )
    );

    return NextResponse.json({ message: 'Location shared successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sharing location:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}