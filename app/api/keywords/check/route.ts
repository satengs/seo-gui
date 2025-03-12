import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { SearchKeywordResponse } from '@/types';

const CHUNK_SIZE = 10;
const PROCESSING_STATUS = new Map();

const extractTotalResults = (searchResults: SearchKeywordResponse): number => {
  if (searchResults.organic_results?.length) {
    return searchResults.organic_results.length;
  }
  return 0;
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

      const searchResults = await searchKeyword(
          keyword.term,
          keyword.location,
          keyword.device
      ) as SearchKeywordResponse;

      if (searchResults.error) {
        results.push({
          keyword: keyword.term,
          error: `SERP API error: ${searchResults.error}`
        });
        continue;
      }

      const dailyData = {
        organicResultsCount: searchResults.search_information?.total_results || 0,
        kgmTitle: searchResults.knowledge_graph?.title || '',
        kgmWebsite: searchResults.knowledge_graph?.website || '',
        difficulty: null,
        volume: null,
        backlinksNeeded: null,
        timestamp: new Date().toISOString()
      };

      // First find the existing keyword to check if it exists
      const existingKeyword = await Keyword.findById(keyword._id);

      // Prepare update operation
      const updateOperation = {
        $set: {
          kgmTitle: searchResults.knowledge_graph?.title || '',
          kgmWebsite: searchResults.knowledge_graph?.website || '',
          organicResultsCount: extractTotalResults(searchResults),
          keywordData: searchResults,
          updatedAt: new Date(),
          [`historicalData.${todayKey}`]: dailyData
        }
      };

      // If keyword doesn't exist, initialize historicalData
      if (!existingKeyword) {
        updateOperation.$setOnInsert = {
          historicalData: {
            [todayKey]: dailyData
          }
        };
      }

      // Update or create the keyword
      await Keyword.findByIdAndUpdate(
          keyword._id,
          updateOperation,
          {
            new: true,
            upsert: true
          }
      );

      results.push({
        keyword: keyword.term,
        success: true,
        dailyData
      });
    } catch (error) {
      console.error(`Failed to check keyword ${keyword.term}:`, error);
      results.push({
        keyword: keyword.term,
        error: error instanceof Error ? error.message : 'Failed to check keyword'
      });
    }
  }

  return results;
}

export async function DELETE() {
  PROCESSING_STATUS.set('cancelled', true);
  return NextResponse.json({ message: 'Keyword check cancelled' });
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    PROCESSING_STATUS.set('cancelled', false);

    console.log('Fetching default keywords...');
    const keywords = await Keyword.find({ isDefaultKeywords: true });

    if (!keywords.length) {
      return NextResponse.json({
        message: 'No default keywords found',
        results: []
      });
    }

    const { searchParams } = new URL(request.url);
    const startIndex = parseInt(searchParams.get('startIndex') || '0');
    const { cancelled, results } = await processKeywordChunk(keywords, startIndex);
    const nextIndex = startIndex + CHUNK_SIZE;
    const hasMore = nextIndex < keywords.length;

    return NextResponse.json({
      totalKeywords: keywords.length,
      processedKeywords: Math.min(nextIndex, keywords.length),
      hasMore: hasMore && !cancelled,
      nextIndex: hasMore ? nextIndex : null,
      results,
      cancelled
    });
  } catch (error) {
    console.error('Failed to check keywords:', error);
    return NextResponse.json(
        {
          error: 'Failed to check keywords',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
    );
  }
}