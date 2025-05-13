import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { seedInitialKeywords } from '@/lib/db/models/Keyword/InitialKeywords';
import { paginateEntities, paginateEntitiesByFilter } from '@/lib/db/helpers';
import { IKeyword, IPaginatedKeywords } from '@/types';
import { SIZE } from '@/consts';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || SIZE;
    const groupBy = searchParams.get('groupBy') || '';
    console.log('groupBy: ', groupBy);
    const result = await Keyword.aggregate([
      {
        $group: {
          _id: '$term',
          // count: { $sum: 1 },
          docs: { $push: '$$ROOT' },
        },
      },
    ]);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch keywords groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords groups' },
      { status: 500 }
    );
  }
}
