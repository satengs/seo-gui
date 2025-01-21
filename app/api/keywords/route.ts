import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import {
  getKeywordData,
  seedInitialKeywords,
} from '@/lib/db/models/Keyword/InitialKeywords';

export async function GET() {
  try {
    await dbConnect();

    // Seed initial keywords if none exist
    const count = await Keyword.countDocuments();
    if (count === 0) {
      await seedInitialKeywords();
    }

    const keywords = await Keyword.find().sort({ createdAt: -1 });
    return NextResponse.json(keywords);
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
    const existingKeyword = await Keyword.findOne({ term: data.term });
    if (existingKeyword) {
      await Keyword.findOneAndUpdate(
        {
          term: data.term,
        },
        {
          $set: {
            isDefaultKeywords: true,
          },
        },
        { new: true, runValidators: true }
      );
      const keywords = await Keyword.find().sort({ createdAt: -1 });
      return NextResponse.json(keywords);
    } else {
      const keywordData = getKeywordData(
        { ...data },
        { isDefaultKeywords: true, term: data?.term }
      );
      await Keyword.create(keywordData);
      const keywords = await Keyword.find().sort({ createdAt: -1 });
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
    await Keyword.findOneAndUpdate(
      {
        term: data.term,
      },
      {
        $set: data.updatedData,
      },
      { new: true, runValidators: true }
    );

    const keywords = await Keyword.find().sort({ createdAt: -1 });
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
    const keyword = searchParams.get('keyword') || '';
    await Keyword.deleteOne({ term: keyword });
    const keywords = await Keyword.find().sort({ createdAt: -1 });
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
