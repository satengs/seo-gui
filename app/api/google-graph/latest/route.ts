import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GoogleGraphData from '@/lib/db/models/GoogleGraphEntity';

export async function GET() {
  await dbConnect();
  // Get the latest document for each keywordId
  const latest = await GoogleGraphData.aggregate([
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
  return NextResponse.json({ data: latest });
} 