import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/schemas/Keyword';
import { seedInitialKeywords } from '@/lib/db/models/Keyword/InitialKeywords';
import { paginateEntities, paginateEntitiesByFilter } from '@/lib/db/helpers';
import { IPaginatedKeywords } from '@/types';
import { SIZE } from '@/consts';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const fullList = searchParams.get('fullList');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || SIZE.toString(), 10);
    const searchTerm = searchParams.get('searchTerm') || '';
    const sortKey = searchParams.get('sortKey') || '';
    const sortDirection = searchParams.get('sortDirection') || 'asc';
    const dateRangeFrom = searchParams.get('dateFrom');
    const dateRangeTo = searchParams.get('dateTo');

    // Seed initial keywords if empty
    const count = await Keyword.countDocuments();
    if (count === 0) {
      await seedInitialKeywords();
    }

    if (fullList) {
      const _keywords = await paginateEntitiesByFilter(
        null,
        null,
        Keyword,
        searchTerm,
        { sortKey, sortDirection },
        { from: dateRangeFrom, to: dateRangeTo }
      );
      return NextResponse.json(_keywords.entitiesData);
    }

    let _keywords: IPaginatedKeywords;
    _keywords = await paginateEntitiesByFilter(
      page as number,
      size as number,
      Keyword,
      searchTerm,
      {
        sortKey,
        sortDirection,
      },
      { from: dateRangeFrom, to: dateRangeTo }
    );

    return NextResponse.json(_keywords);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

//Create the new keyword
export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    if (data?.['_id']) {
      await Keyword.findOneAndUpdate(
        {
          term: data.term,
          device: data?.device,
          location: data?.location,
        },
        {
          $set: {
            isDefaultKeywords: true,
          },
        },
        { new: true, runValidators: true }
      );
      const keywords = await paginateEntities(
        page as number,
        size as number,
        Keyword
      );
      return NextResponse.json(keywords);
    }
  } catch (error) {
    console.error('Failed to create keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

//Change keyword
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    await Keyword.findOneAndUpdate(
      {
        term: data.term,
        location: data?.keywordData?.location,
        device: data?.keywordData?.device,
      },
      {
        $set: data.updatedData,
      },
      { new: true, runValidators: true }
    );

    const keywords = await paginateEntities(
      page as number,
      size as number,
      Keyword
    );

    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to update keyword:', error);
    return NextResponse.json(
      { error: 'Failed to update keywords' },
      { status: 500 }
    );
  }
}

//Delete keyword
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    const keyword = searchParams.get('keyword') || '';
    await Keyword.deleteOne({ _id: keyword });
    const keywords = await paginateEntities(
      page as number,
      size as number,
      Keyword
    );
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);

    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
