import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { checkDateDifference } from '@/lib/utils';
import { getKeywordData } from '@/lib/db/models/Keyword/InitialKeywords';
import { paginateEntities } from '@/lib/db/helpers';
import { SearchKeywordResponse } from '@/types';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || 10;
    const keywordsArr = data?.term?.split('\n');

    for (let i = 0; i < keywordsArr?.length; i++) {
      const existKeyword = await Keyword.findOne({
        term: keywordsArr[i],
        location: data?.location,
        device: data?.device,
      });
      if (existKeyword) {
        const dateDiff = checkDateDifference(
          new Date(),
          existKeyword.updatedAt
        );

        if (dateDiff >= 1) {
          const updatedKeywordData = await getKeywordData(
            keywordsArr[i],
            data?.location,
            data?.device
          );

          if (updatedKeywordData) {
            await Keyword.findOneAndUpdate(
              {
                term: keywordsArr[i],
                location: data?.location,
                device: data?.device,
              },
              {
                $set: updatedKeywordData,
              },
              { new: true, runValidators: true }
            );
          }
        }
      } else {
        const newKeywordData = await getKeywordData(
          keywordsArr[i],
          data?.location,
          data?.device,
          true
        );
        await Keyword.create(newKeywordData);
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

    const searchResponse = (await searchKeyword(
      term,
      location,
      device
    )) as SearchKeywordResponse;

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
      historicalData: new Map([
        [
          todayKey,
          {
            organicResultsCount:
              searchResponse.search_information?.total_results || 0,
            kgmTitle: searchResponse.knowledge_graph?.title || '',
            kgmWebsite: searchResponse.knowledge_graph?.website || '',
            difficulty: null,
            volume: null,
            backlinksNeeded: null,
            timestamp: new Date().toISOString(),
          },
        ],
      ]),
    };

    const keyword = await Keyword.create(keywordData);

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
