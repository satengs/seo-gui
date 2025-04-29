import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/schemas/Keyword';
import { seedInitialKeywords } from '@/lib/db/models/Keyword/InitialKeywords';
import { paginateEntities, paginateEntitiesByFilter } from '@/lib/db/helpers';
import { IKeyword, IPaginatedKeywords } from '@/types';
import { SIZE } from '@/consts';


export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const fullList = searchParams.get('fullList');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const size = parseInt(searchParams.get('size') || SIZE.toString(), 10);
    const searchTerm = searchParams.get('searchTerm') || '';
    const sortKey = searchParams.get('sortKey') || 'created';
    const sortDirection = searchParams.get('sortDirection') === 'desc' ? -1 : 1;
    const dateRangeFrom = searchParams.get('dateFrom');
    const dateRangeTo = searchParams.get('dateTo');

    // Seed initial keywords if empty
    const count = await Keyword.countDocuments();
    if (count === 0) {
      await seedInitialKeywords();
    }

    if (fullList) {
      const keywords = await Keyword.find().sort({ created: -1 });
      return NextResponse.json(keywords);
    }

    // Build match conditions
    const matchConditions: any = {};

    if (searchTerm) {
      matchConditions.term = { $regex: searchTerm, $options: 'i' };
    }

    if (dateRangeFrom || dateRangeTo) {
      matchConditions.created = {};
      if (dateRangeFrom) matchConditions.created.$gte = new Date(dateRangeFrom);
      if (dateRangeTo) matchConditions.created.$lte = new Date(dateRangeTo);
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'keywordHistoricalData',
          localField: '_id',
          foreignField: 'keywordId',
          as: 'historicalData',
        },
      },
      { $sort: { [sortKey]: sortDirection } },
      { $skip: (page - 1) * size },
      { $limit: size },
    ];

    const keywords = await Keyword.aggregate(pipeline);

    // Get total count for pagination
    const total = await Keyword.countDocuments(matchConditions);

    return NextResponse.json({
      currentPage: page,
      entitiesData: keywords,
      totalCount: total,
      totalPages: Math.ceil(total / size),
    });
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
      console.log('_keywords', keywords)

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
