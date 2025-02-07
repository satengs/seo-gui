import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { getKeywordData } from '@/lib/db/models/Keyword/InitialKeywords';
import { checkDateDifference } from '@/lib/utils';
import { paginateEntities } from '@/lib/db/helpers';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 1;
    const size = searchParams.get('size') || 10;
    const keywordsArr = data?.term?.split('\n');

    for (let i = 0; i < keywordsArr?.length; i++) {
      const existKeyword = await Keyword.findOne({
        term: keywordsArr[i],
        location: data?.location,
        device: data?.device,
      });
      if (existKeyword) {
        const dateDiff = checkDateDifference(
          new Date(),
          existKeyword.updatedAt
        );

        if (dateDiff >= 1) {
          const updatedKeyword: any = await searchKeyword(
            keywordsArr[i],
            data?.location,
            data?.device
          );
          const updatedKeywordData = getKeywordData(
            updatedKeyword,
            existKeyword
          );
          await Keyword.findOneAndUpdate(
            {
              term: keywordsArr[i],
              location: data?.location,
              device: data?.device,
            },
            {
              $set: updatedKeywordData,
            },
            { new: true, runValidators: true }
          );
        }
      } else {
        const searchKeywordData: any = await searchKeyword(
          keywordsArr[i],
          data?.location,
          data?.device
        );
        const newKeywordData = getKeywordData(searchKeywordData, {
          isDefaultKeywords: data?.isDefaultKeywords,
        });
        await Keyword.create(newKeywordData);
      }
    }
    const keywords = await paginateEntities(
      page as number,
      size as number,
      Keyword
    );
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to create keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const keywords = Keyword.find({
      term: term,
    });

    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Failed to create keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}
