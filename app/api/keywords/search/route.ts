import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Location from '@/lib/db/models/Location';
import Keyword from '@/lib/db/models/schemas/Keyword';
import KeywordHistoricalData from '@/lib/db/models/schemas/KeywordHistoricalData';
import { searchKeyword } from '@/lib/serpApi';
import { findAndUpdateDailyKeyword } from '@/lib/db/models/Keyword/InitialKeywords';
import { paginateEntities } from '@/lib/db/helpers';
import { SearchKeywordResponse } from '@/types';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || 30;
    const keywordsArr = data?.term?.split('\n');
    for (let i = 0; i < keywordsArr?.length; i++) {
      if (data?.includeDefaultLocation && !data?.location) {
        const defaultLocations = await Location.find();
        for (let l = 0; l < defaultLocations.length; l++) {
          const currentLocation = defaultLocations[l].location;
          await findAndUpdateDailyKeyword({
            keyword: keywordsArr[i],
            location: currentLocation,
            device: data.device,
            isDefaultKeywords: data.isDefaultKeywords,
          });
        }
      } else {
        await findAndUpdateDailyKeyword({
          keyword: keywordsArr[i],
          location: data?.location,
          device: data.device,
          isDefaultKeywords: data.isDefaultKeywords,
        });
      }
    }
    const keywords = await paginateEntities(
      page as number,
      size as number,
      Keyword
    );
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to create keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();

    const data = await request.json();
    const { term, location, device, isDefaultKeywords } = data;

    const searchResponse = (await searchKeyword({
      keyword: term,
      location,
      device,
    })) as SearchKeywordResponse;

    if (searchResponse.error) {
      return NextResponse.json(
        { error: searchResponse.error },
        { status: 400 }
      );
    }

    const todayKey = new Date().toISOString().split('T')[0];

    const keyword = await Keyword.create({
      term,
      location,
      device,
      isDefaultKeywords,
    });

    await KeywordHistoricalData.create({
      id: keyword._id,
      date: todayKey,
      organicResultsCount:
        searchResponse.search_information?.total_results || 0,
      kgmid: searchResponse.knowledge_graph?.kgmid || '',
      kgmTitle: searchResponse.knowledge_graph?.title || '',
      kgmWebsite: searchResponse.knowledge_graph?.website || '',
      difficulty: searchResponse.search_information?.difficulty || null,
      volume: searchResponse.search_information?.volume || null,
      backlinksNeeded: null,
      timestamp: new Date(),
      keywordData: searchResponse,
    });

    return NextResponse.json({
      entitiesData: [keyword],
      totalCount: 1,
      totalPages: 1,
      currentPage: 1,
    });
  } catch (error) {
    console.error('Failed to search keyword:', error);
    return NextResponse.json(
      { error: 'Failed to search keyword' },
      { status: 500 }
    );
  }
}
