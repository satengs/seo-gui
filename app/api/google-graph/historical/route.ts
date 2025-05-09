import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GoogleGraphData from '@/lib/db/models/GoogleGraphEntity';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const docs = await GoogleGraphData.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: docs });
  } catch (error) {
    console.log('[API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch historical data.' }, { status: 500 });
  }
}
