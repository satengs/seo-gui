import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/schemas/Keyword';
import KeywordHistoricalData from '@/lib/db/models/schemas/KeywordHistoricalData';
import { searchKeyword } from '@/lib/serpApi';
import { SearchKeywordResponse } from '@/types';

const CHUNK_SIZE = 10;
const PROCESSING_STATUS = new Map();

const extractTotalResults = (searchResults: SearchKeywordResponse): number => {
  return searchResults.organic_results?.length || 0;
};

async function processKeywordChunk(keywords: any[], startIndex: number) {
  const chunk = keywords.slice(startIndex, startIndex + CHUNK_SIZE);
  const results = [];
  const todayKey = new Date().toISOString().split('T')[0];

  for (const keyword of chunk) {
    try {
      console.log(`Processing keyword: ${keyword.term}`);

      // Check if processing was cancelled
      if (PROCESSING_STATUS.get('cancelled')) {
        return { cancelled: true, results };
      }

      const searchResults = (await searchKeyword({
        keyword: keyword.term,
        location: keyword.location,
        device: keyword.device,
      })) as SearchKeywordResponse;

      if (searchResults.error) {
        results.push({
          keyword: keyword.term,
          error: `SERP API error: ${searchResults.error}`,
        });
        continue;
      }

      // Check if historical data for today already exists
      const existingEntry = await KeywordHistoricalData.findOne({
        id: keyword._id,
        date: todayKey,
      });

      if (!existingEntry) {
        await KeywordHistoricalData.create({
          id: keyword._id,
          date: todayKey,
          organicResultsCount:
            searchResults.search_information?.total_results || 0,
          kgmid: searchResults.knowledge_graph?.kgmid || '',
          kgmTitle: searchResults.knowledge_graph?.title || '',
          kgmWebsite: searchResults.knowledge_graph?.website || '',
          volume: searchResults.search_information?.volume || null,
          difficulty: searchResults.search_information?.difficulty || null,
          backlinksNeeded: null,
          timestamp: new Date().toISOString(),
          keywordData: searchResults,
        });
      }

      // Update latest values in Keyword document
      await Keyword.findByIdAndUpdate(
        keyword._id,
        {
          $set: {
            kgmid: searchResults.knowledge_graph?.kgmid || '',
            kgmTitle: searchResults.knowledge_graph?.title || '',
            kgmWebsite: searchResults.knowledge_graph?.website || '',
            organicResultsCount: extractTotalResults(searchResults),
            'keywordData.data': { ...searchResults },
            updatedAt: new Date(),
          },
        },
        { new: true }
      );

      results.push({ keyword: keyword.term, success: true });
    } catch (error) {
      console.error(`Failed to check keyword ${keyword.term}:`, error);
      results.push({
        keyword: keyword.term,
        error:
          error instanceof Error ? error.message : 'Failed to check keyword',
      });
    }
  }

  return { cancelled: false, results };
}

export async function DELETE() {
  PROCESSING_STATUS.set('cancelled', true);
  return NextResponse.json({ message: 'Keyword check cancelled' });
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const isCancelled = PROCESSING_STATUS.get('cancelled');
    if (!isCancelled) {
      PROCESSING_STATUS.set('cancelled', false);
    }
    if (isCancelled) {
    }

    const { items } = await request.json();
    let query: Record<string, any> = {};

    console.log('Fetching default keywords...');
    if (items.length > 0) {
      query._id = { $in: items };
    } else {
      query.isDefaultKeywords = true;
    }

    const keywords = await Keyword.find(query);

    if (!keywords.length) {
      return NextResponse.json({
        message: 'No default keywords found',
        results: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const startIndex = parseInt(searchParams.get('startIndex') || '0');
    const { cancelled, results } = await processKeywordChunk(
      keywords,
      startIndex
    );

    const nextIndex = startIndex + CHUNK_SIZE;
    const hasMore = nextIndex < keywords.length;

    return NextResponse.json({
      totalKeywords: keywords.length,
      processedKeywords: Math.min(nextIndex, keywords.length),
      hasMore: hasMore && !cancelled,
      nextIndex: hasMore ? nextIndex : null,
      results,
      cancelled,
    });
  } catch (error) {
    console.error('Failed to check keywords:', error);
    return NextResponse.json(
      {
        error: 'Failed to check keywords',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
