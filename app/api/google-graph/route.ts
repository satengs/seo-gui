import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GoogleGraphData from '@/lib/db/models/GoogleGraphEntity';
import { GoogleGraphApiService } from '@/lib/utils/googleGraphApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keywordId = searchParams.get('keywordId');
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const latest = searchParams.get('latest') === 'true';

    console.log('[Google Graph API] Request params:', {
      keywordId,
      query,
      page,
      limit,
      sortBy,
      sortOrder,
      latest
    });

    await dbConnect();

    // If latest flag is set, return latest data for each keyword
    if (latest) {
      try {
        const latestData = await GoogleGraphData.aggregate([
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: '$keywordId',
              keywordId: { $first: '$keywordId' },
              term: { $first: '$term' },
              createdAt: { $first: '$createdAt' },
            }
          },
          { $sort: { createdAt: -1 } }
        ]);
        return NextResponse.json({ data: latestData });
      } catch (error) {
        throw error;
      }
    }

    const queryFilter: any = {};
    if (keywordId) {
      queryFilter.keywordId = keywordId;
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;


    const docs = await GoogleGraphData.find(queryFilter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await GoogleGraphData.countDocuments(queryFilter);

    return NextResponse.json({
      data: docs,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch Google Graph data.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { keywordId, term, data, timestamp } = body;

    const entitiesData = Array.isArray(data) ? data : [];

    if (!keywordId || !term) {
      return NextResponse.json(
        { error: 'Missing required fields: keywordId and term are required' },
        { status: 400 }
      );
    }

    const date = new Date(timestamp || new Date());
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

    const existing = await GoogleGraphData.findOne({
      keywordId,
      createdAt: { $gte: start, $lte: end }
    });

    if (existing) {
      return NextResponse.json({
        message: 'A document for this keyword and date already exists.',
        id: existing._id
      }, { status: 200 });
    }

    let finalData = entitiesData;
    if (entitiesData.length === 0) {
      try {
        const googleGraphService = GoogleGraphApiService.getInstance();
        const result = await googleGraphService.processBatch([term]);
        const response = result.get(term);
        if (response && !response.error) {
          finalData = response.entitiesData;
        } else {
          throw new Error(response?.error || 'Failed to fetch data from Google Graph API');
        }
      } catch (error) {
        throw error;
      }
    }

    const documentToSave = {
      keywordId,
      term,
      createdAt: timestamp || new Date(),
      data: finalData,
    };
    const savedData = await GoogleGraphData.create(documentToSave);


    return NextResponse.json({
      message: 'Google Graph API response saved successfully.',
      id: savedData._id,
      savedData: {
        keywordId: savedData.keywordId,
        term: savedData.term,
        dataLength: savedData.data?.length || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to save Google Graph API response.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
