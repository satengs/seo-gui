import { NextResponse } from 'next/server';
import { getAccountInfo } from '@/lib/serpApi';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/schemas/Keyword';
import KeywordHistoricalMore from '@/lib/db/models/schemas/KeywordHistocalMore';

export async function GET() {
  try {
    await dbConnect();
    const accountData = await getAccountInfo();
    const lastSearchKeyword = await Keyword.findOne().sort({ updatedAt: -1 }); // historical data
    const lastSearchKeywordHistorical =
      await KeywordHistoricalMore.findOne().sort({ updatedAt: -1 }); // historical data
    const lastSearchDate =
      lastSearchKeyword.updatedAt > lastSearchKeywordHistorical.updatedAt
        ? lastSearchKeyword.updatedAt
        : lastSearchKeywordHistorical.updatedAt;

    return NextResponse.json({ ...accountData, lastSearchDate });
  } catch (error) {
    console.error('Failed to fetch account data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account data' },
      { status: 500 }
    );
  }
}
