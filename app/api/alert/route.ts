// pages/api/alert.ts

import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest, NextResponse
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Named export for POST method (using new app directory structure)
export async function POST(req: NextRequest) {
  const { latitude, longitude, guardians } = await req.json();

  if (!latitude || !longitude || !guardians || guardians.length === 0) {
    return NextResponse.json({ error: 'Missing required information' }, { status: 400 });
  }

  try {
    // Send SMS to all guardians
    for (const guardian of guardians) {
      await client.messages.create({
        body: `ALERT: I need help! My location is: https://www.google.com/maps?q=${latitude},${longitude}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: guardian.phone,
      });
    }

    // Return success response
    return NextResponse.json({ message: 'Alert sent successfully to guardians!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending alert:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}