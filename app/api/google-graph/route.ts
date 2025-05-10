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
        console.log('[Google Graph API] Latest data count:', latestData.length);
        return NextResponse.json({ data: latestData });
      } catch (error) {
        console.error('[Google Graph API] Error fetching latest data:', error);
        throw error;
      }
    }

    // Build query
    const queryFilter: any = {};
    if (keywordId) {
      queryFilter.keywordId = keywordId;
    }

    // Build sort options
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    console.log('[Google Graph API] Query filter:', queryFilter);
    console.log('[Google Graph API] Sort options:', sortOptions);

    // Execute query with pagination
    const docs = await GoogleGraphData.find(queryFilter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await GoogleGraphData.countDocuments(queryFilter);

    console.log('[Google Graph API] Query results:', {
      docsCount: docs.length,
      totalCount,
      page,
      limit
    });

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
    console.error('[Google Graph API] Error:', error);
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

    console.log('[Google Graph API] Save request:', {
      keywordId,
      term,
      dataLength: data?.length,
      timestamp
    });

    // Always ensure data is an array (never undefined)
    const entitiesData = Array.isArray(data) ? data : [];

    if (!keywordId || !term) {
      console.error('[Google Graph API] Missing required fields:', { keywordId, term });
      return NextResponse.json(
        { error: 'Missing required fields: keywordId and term are required' },
        { status: 400 }
      );
    }

    // Prevent duplicate for same keywordId and date (ignoring time, use UTC)
    const date = new Date(timestamp || new Date());
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

    console.log('[Google Graph API] Checking for duplicates:', {
      keywordId,
      start,
      end
    });

    const existing = await GoogleGraphData.findOne({
      keywordId,
      createdAt: { $gte: start, $lte: end }
    });

    if (existing) {
      console.log('[Google Graph API] Found existing document:', existing._id);
      return NextResponse.json({
        message: 'A document for this keyword and date already exists.',
        id: existing._id
      }, { status: 200 });
    }

    // If no data provided, fetch from Google Graph API
    let finalData = entitiesData;
    if (entitiesData.length === 0) {
      try {
        console.log('[Google Graph API] Fetching data from Google Graph API for term:', term);
        const googleGraphService = GoogleGraphApiService.getInstance();
        const result = await googleGraphService.processBatch([term]);
        const response = result.get(term);
        if (response && !response.error) {
          finalData = response.entitiesData;
          console.log('[Google Graph API] Successfully fetched data, entities count:', finalData.length);
        } else {
          console.error('[Google Graph API] Error in Google Graph API response:', response?.error);
          throw new Error(response?.error || 'Failed to fetch data from Google Graph API');
        }
      } catch (error) {
        console.error('[Google Graph API] Error fetching from Google Graph API:', error);
        throw error;
      }
    }

    const documentToSave = {
      keywordId,
      term,
      createdAt: timestamp || new Date(),
      data: finalData,
    };

    console.log('[Google Graph API] Saving document:', {
      keywordId,
      term,
      dataLength: finalData.length
    });

    const savedData = await GoogleGraphData.create(documentToSave);

    console.log('[Google Graph API] Document saved successfully:', savedData._id);

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
    console.error('[Google Graph API] Error saving data:', error);
    return NextResponse.json(
      {
        error: 'Failed to save Google Graph API response.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
