import { NextResponse } from 'next/server';
import { getAccountInfo } from '@/lib/serpApi';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';

export async function GET() {
  try {
    await dbConnect();
    const accountData = await getAccountInfo();
    const lastSearch = await Keyword.findOne().sort({ updatedAt: -1 }); // historical data

    return NextResponse.json({ ...accountData, lastSearch });
  } catch (error) {
    console.error('Failed to fetch account data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account data' },
      { status: 500 }
    );
  }
}
