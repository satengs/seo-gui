import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { getKeywordData } from '@/lib/db/models/Keyword/InitialKeywords';
import { checkDateDifference } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    const existKeyword = await Keyword.findOne({
      term: data?.term,
    });

    if (!existKeyword) {
      const newKeyword: any = await searchKeyword(
        data?.term,
        data?.location,
        data?.device
      );
      const keywords = await Keyword.find().sort({ createdAt: -1 });
      return NextResponse.json([
        {
          ...newKeyword,
          term: data?.term,
        },
        ...keywords,
      ]);
    } else {
      const dateDiff = checkDateDifference(new Date(), existKeyword.updatedAt);

      if (dateDiff >= 1) {
        const updatedKeyword: any = await searchKeyword(
          data?.term,
          data?.location,
          data?.device
        );
        const updatedKeywordData = getKeywordData(updatedKeyword, existKeyword);
        await Keyword.findOneAndUpdate(
          {
            term: data.term,
          },
          {
            $set: updatedKeywordData,
          },
          { new: true, runValidators: true }
        );
        const keywords = await Keyword.find().sort({ createdAt: -1 });
        return NextResponse.json(keywords);
      } else {
        const keywords = await Keyword.find().sort({ createdAt: -1 });
        return NextResponse.json(keywords);
      }
    }
  } catch (error) {
    console.error('Failed to create keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}
