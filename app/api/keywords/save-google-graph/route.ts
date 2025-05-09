import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GoogleGraphData from '@/lib/db/models/GoogleGraphEntity';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { keywordId, term, data, timestamp } = await request.json();

    // Always ensure data is an array (never undefined)
    const entitiesData = Array.isArray(data) ? data : [];

    if (!keywordId || !term) {
      return NextResponse.json(
        { error: 'Missing required fields: keywordId and term are required' },
        { status: 400 }
      );
    }

    // Prevent duplicate for same keywordId and date (ignoring time, use UTC)
    const date = new Date(timestamp || new Date());
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

    console.log('Checking for existing:', { keywordId, start, end });
    const existing = await GoogleGraphData.findOne({
      keywordId,
      createdAt: { $gte: start, $lte: end }
    });
    console.log('Existing found:', existing);

    if (existing) {
      return NextResponse.json({
        message: 'A document for this keyword and date already exists.',
        id: existing._id
      }, { status: 200 });
    }

    const documentToSave = {
      keywordId,
      term,
      createdAt: timestamp || new Date(),
      data: entitiesData, // Always present, even if empty
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
