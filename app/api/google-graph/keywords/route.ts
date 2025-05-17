import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/index';
import Keyword from '@/lib/db/models/Keyword/Keyword';

export async function GET() {
  try {
    await dbConnect();
    const keywords = await Keyword.find({}).select('term _id').lean();

    return NextResponse.json(keywords);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
