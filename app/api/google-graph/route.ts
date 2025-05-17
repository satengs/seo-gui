import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GoogleGraphData from '@/lib/db/models/GoogleGraph';
import { GoogleGraphApiService } from '@/lib/utils/googleGraphApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '30');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    const searchTerm = searchParams.get('searchTerm');
    const keywordId = searchParams.get('keywordId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    await dbConnect();

    // Build the query
    let query: any = {};

    // If searching for a specific keyword's history
    if (keywordId) {
      query.keywordId = keywordId;
    } else {
      const latestEntries = await GoogleGraphData.aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: '$keywordId',
            latestId: { $first: '$_id' },
          },
        },
      ]).exec();

      const latestIds = latestEntries.map((entry) => entry.latestId);
      query._id = { $in: latestIds };
    }

    // Add date range if provided
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Add search condition if searchTerm is provided
    if (searchTerm) {
      query.term = { $regex: searchTerm, $options: 'i' };
    }

    // Get total count for pagination
    const total = await GoogleGraphData.countDocuments(query);

    // Apply sorting
    const sort: any = {};
    if (sortBy === 'createdAt') {
      sort.createdAt = sortDirection === 'asc' ? 1 : -1;
    } else if (sortBy === 'term') {
      sort.term = sortDirection === 'asc' ? 1 : -1;
    }

    // Execute the query with pagination
    const data = await GoogleGraphData.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Google Graph data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { keywordId, term, data, timestamp, update = false } = body;
    if (!keywordId || !term) {
      return NextResponse.json(
        { error: 'Missing required fields: keywordId and term are required' },
        { status: 400 }
      );
    }

    const date = new Date(timestamp || new Date());
    const start = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const end = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const existing = await GoogleGraphData.findOne({
      keywordId,
      createdAt: { $gte: start, $lte: end },
    });

    let finalData = Array.isArray(data) ? data : [];

    if (finalData.length === 0) {
      try {
        const googleGraphService = GoogleGraphApiService.getInstance();
        const result = await googleGraphService.processBatch([term]);
        const response = result.get(term);

        if (response && !response.error) {
          finalData = response.entitiesData;
        } else {
          throw new Error(
            response?.error || 'Failed to fetch data from Google Graph API'
          );
        }
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to fetch data from Google Graph API',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
          { status: 500 }
        );
      }
    }

    let savedData;

    if (existing && update) {
      savedData = await GoogleGraphData.findByIdAndUpdate(
        existing._id,
        {
          $set: {
            data: finalData,
            term: term,
            createdAt: timestamp || new Date(),
          },
        },
        { new: true, runValidators: true }
      );
    } else if (!existing) {
      const documentToSave = {
        keywordId,
        term,
        createdAt: timestamp || new Date(),
        data: finalData,
      };

      savedData = await GoogleGraphData.create(documentToSave);
    } else {
      return NextResponse.json(
        {
          message: 'A document for this keyword and date already exists.',
          id: existing._id,
          data: existing.data,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      message: update
        ? 'Google Graph API response updated successfully.'
        : 'Google Graph API response saved successfully.',
      id: savedData._id,
      savedData: {
        keywordId: savedData.keywordId,
        term: savedData.term,
        dataLength: savedData.data?.length || 0,
        sampleData: savedData.data?.[0] || null,
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
