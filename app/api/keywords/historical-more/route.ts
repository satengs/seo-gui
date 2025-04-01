import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { IKeyword } from '@/types';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import KeywordHistoricalMore from '@/lib/db/models/KeywordHistoricalMore';
import { searchKeyword } from '@/lib/serpApi';

export async function GET() {
  try {
    await dbConnect();
    const keywords: IKeyword[] = await Keyword.find({
      isDefaultKeywords: true,
    });
    const todayKey = new Date().toISOString().split('T')[0];
    const startOfDay = new Date(todayKey + 'T00:00:00.000Z'); // Midnight today (UTC)
    const endOfDay = new Date(todayKey + 'T23:59:59.999Z');
    if (keywords?.length) {
      for (let k = 0; k < keywords.length; k++) {
        const keyword = keywords[k];
        const existInHistoricalMoreKeyword =
          await KeywordHistoricalMore.findOne({
            keywordId: keyword._id,
            createdAt: {
              $gte: startOfDay, // Greater than or equal to start of today
              $lt: endOfDay, // Less than end of today
            },
          });
        if (!existInHistoricalMoreKeyword) {
          const searchParams = {
            keyword: keyword.term,
            location: keyword.location,
            device: keyword.device,
            start: 0,
            num: 30,
            type: 'json',
          };
          const _keyword = await searchKeyword(searchParams);
          const newHistorical = {
            keywordId: keyword._id,
            historicalMore: {
              data: _keyword,
            },
          };

          await KeywordHistoricalMore.create(newHistorical);
        }
      }
    }
    return NextResponse.json({ message: true });
  } catch (error) {
    console.error('Failed to fetch more historical of keyword:', error);
    return NextResponse.json(
      { error: 'Failed to fetch more historical of keyword' },
      { status: 500 }
    );
  }
}
