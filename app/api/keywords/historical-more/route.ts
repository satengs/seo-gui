import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { IKeyword } from '@/types';
import Keyword from '@/lib/db/models/schemas/Keyword';
import KeywordHistoricalMore from '@/lib/db/models/schemas/KeywordHistocalMore';
import { searchKeyword } from '@/lib/serpApi';

const CHUNK_SIZE = 10;
let processingJobId: string | null = null;

async function getProcessingStatus(keywordIds: string[]) {
  let query: Record<string, any> = {};
  let totalKeywords: number;

  if (keywordIds.length > 0) {
    query._id = { $in: keywordIds };
    totalKeywords = keywordIds.length;
  } else {
    query.isDefaultKeywords = true;
    totalKeywords = await Keyword.countDocuments({ isDefaultKeywords: true });
  }

  const todayKey = new Date().toISOString().split('T')[0];
  const startOfDay = new Date(todayKey + 'T00:00:00.000Z');
  const endOfDay = new Date(todayKey + 'T23:59:59.999Z');

  const processedCount = await KeywordHistoricalMore.countDocuments({
    createdAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    ...(keywordIds.length > 0 && { keywordId: { $in: keywordIds } }),
  });

  return {
    isProcessing: !!processingJobId,
    processedPercent:
      totalKeywords > 0 ? (processedCount / totalKeywords) * 100 : 0,
    processedCount,
    processedTotal: totalKeywords,
  };
}

async function processKeywords(keywordIds: string[]) {
  try {
    let query: Record<string, any> = {};
    let totalKeywords: number;

    if (keywordIds.length > 0) {
      query._id = { $in: keywordIds };
      totalKeywords = keywordIds.length;
    } else {
      query.isDefaultKeywords = true;
      totalKeywords = await Keyword.countDocuments({ isDefaultKeywords: true });
    }

    let processedCount = 0;

    while (processedCount < totalKeywords && processingJobId) {
      const keywords: IKeyword[] = await Keyword.find(query)
        .skip(processedCount)
        .limit(CHUNK_SIZE);

      const todayKey = new Date().toISOString().split('T')[0];
      const startOfDay = new Date(todayKey + 'T00:00:00.000Z');
      const endOfDay = new Date(todayKey + 'T23:59:59.999Z');

      for (const keyword of keywords) {
        if (!processingJobId) break;

        const existingRecord = await KeywordHistoricalMore.findOne({
          keywordId: keyword._id,
          createdAt: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
        });

        if (!existingRecord) {
          const searchParams = {
            keyword: keyword.term,
            location: keyword.location,
            device: keyword.device,
            start: 0,
            num: 30,
            type: 'json',
          };

          const searchResult = await searchKeyword(searchParams);

          await KeywordHistoricalMore.create({
            keywordId: keyword._id,
            historicalMore: {
              data: searchResult,
            },
          });
        }
      }

      processedCount += keywords.length;
    }

    if (processedCount >= totalKeywords) {
      processingJobId = null;
    }
  } catch (error) {
    console.error('Error in processKeywords:', error);
    processingJobId = null;
  }
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const { items = [] } = await req.json();

    await dbConnect();

    if (action === 'start') {
      if (processingJobId) {
        return NextResponse.json({
          message: 'Processing already in progress',
          jobId: processingJobId,
        });
      }

      processingJobId = new Date().getTime().toString();
      processKeywords(items).catch(console.error);

      return NextResponse.json({
        message: 'Processing started',
        jobId: processingJobId,
      });
    } else if (action === 'stop') {
      processingJobId = null;
      return NextResponse.json({
        message: 'Processing stopped',
      });
    } else if (action === 'status') {
      const status = await getProcessingStatus(items);
      return NextResponse.json(status);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
