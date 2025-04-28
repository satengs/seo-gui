import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { IKeyword } from '@/types';
import Keyword from '@/lib/db/models/schemas/Keyword';
import KeywordHistoricalMore from '@/lib/db/models/schemas/KeywordHistocalMore.ts';
import { searchKeyword } from '@/lib/serpApi';

const CHUNK_SIZE = 5; // Process 5 keywords at a time
let isProcessing = false;
let shouldStop = false;

async function processAllKeywords() {
  if (isProcessing) {
    return { error: 'Processing already in progress' };
  }

  try {
    isProcessing = true;
    shouldStop = false;

    await dbConnect();

    const totalKeywords = await Keyword.countDocuments({
      isDefaultKeywords: true,
    });
    let processedCount = 0;

    while (processedCount < totalKeywords && !shouldStop) {
      const keywords: IKeyword[] = await Keyword.find({
        isDefaultKeywords: true,
      })
        .skip(processedCount)
        .limit(CHUNK_SIZE);

      const todayKey = new Date().toISOString().split('T')[0];
      const startOfDay = new Date(todayKey + 'T00:00:00.000Z');
      const endOfDay = new Date(todayKey + 'T23:59:59.999Z');

      for (const keyword of keywords) {
        if (shouldStop) break;

        const existInHistoricalMoreKeyword =
          await KeywordHistoricalMore.findOne({
            keywordId: keyword._id,
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
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

          await KeywordHistoricalMore.create({
            keywordId: keyword._id,
            historicalMore: {
              data: _keyword,
            },
          });
        }
      }

      processedCount += keywords.length;
    }

    return {
      success: true,
      processedCount,
      totalCount: totalKeywords,
      stopped: shouldStop,
    };
  } catch (error) {
    console.error('Error processing keywords:', error);
    return { error: 'Failed to process keywords' };
  } finally {
    isProcessing = false;
    shouldStop = false;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    console.log('action: ', action);

    if (action === 'start') {
      processAllKeywords().catch(console.error);
      return NextResponse.json({ message: 'Processing started' });
    } else if (action === 'stop') {
      shouldStop = true;
      return NextResponse.json({
        message: 'Processing will stop after current chunk',
      });
    } else if (action === 'status') {
      return NextResponse.json({
        isProcessing,
        shouldStop,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
