import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { SearchKeywordResponse } from '@/types';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const data = await request.json();
    const { term, location, device, isDefaultKeywords } = data;

    const searchResponse = await searchKeyword(term, location, device) as SearchKeywordResponse;

    if (searchResponse.error) {
      return NextResponse.json(
          { error: searchResponse.error },
          { status: 400 }
      );
    }

    const todayKey = new Date().toISOString().split('T')[0];

    const keywordData = {
      term,
      location,
      device,
      isDefaultKeywords,
      historicalData: new Map([[todayKey, {
        organicResultsCount: searchResponse.search_information?.total_results || 0,
        kgmTitle: searchResponse.knowledge_graph?.title || '',
        kgmWebsite: searchResponse.knowledge_graph?.website || '',
        difficulty: null,
        volume: null,
        backlinksNeeded: null,
        timestamp: new Date().toISOString()
      }]])
    };

    const keyword = await Keyword.create(keywordData);

    return NextResponse.json({
      entitiesData: [keyword],
      totalCount: 1,
      totalPages: 1,
      currentPage: 1
    });
  } catch (error) {
    console.error('Failed to search keyword:', error);
    return NextResponse.json(
        { error: 'Failed to search keyword' },
        { status: 500 }
    );
  }
}