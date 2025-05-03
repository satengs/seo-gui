import dbConnect from '@/lib/db';
import { IOrganicResultsHistoricalData } from '@/types';
import { NextResponse } from 'next/server';
import KeywordHistoricalMore from '@/lib/db/models/schemas/KeywordHistoricalData';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const id = (await params).id;
    const keywordHistoricalMoreMap: IOrganicResultsHistoricalData = {};
    const keywordHistoricalMore = await KeywordHistoricalMore.find({
      keywordId: id,
    });
    if (keywordHistoricalMore?.length) {
      for (let kh = 0; kh < keywordHistoricalMore.length; kh++) {
        const _keyword = keywordHistoricalMore[kh];
        const dateKey = _keyword.createdAt.toISOString().split('T')[0];
        keywordHistoricalMoreMap[`${dateKey}`] = _keyword.historicalMore.data;
      }
    }
    return NextResponse.json(keywordHistoricalMoreMap);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
