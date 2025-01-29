import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import {
  getKeywordData,
  seedInitialKeywords,
} from '@/lib/db/models/Keyword/InitialKeywords';
import { paginateEntities } from '@/lib/db/helpers';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || 10;

    // Seed initial keywords if none exist
    const count = await Keyword.countDocuments();
    if (count === 0) {
      await seedInitialKeywords();
    }

    const _keywords = await paginateEntities(
      page as number,
      size as number,
      Keyword
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
    const size = searchParams.get('size') || 10;
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
    } else {
      const keywordData = getKeywordData(
        { ...data },
        { isDefaultKeywords: true, term: data?.term }
      );
      await Keyword.create(keywordData);
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
    const size = searchParams.get('size') || 10;
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
    const size = searchParams.get('size') || 10;
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
