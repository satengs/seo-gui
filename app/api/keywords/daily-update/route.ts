import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import {
  getKeywordData,
  seedInitialKeywords,
} from '@/lib/db/models/Keyword/InitialKeywords';
import { searchKeyword } from '@/lib/serpApi';

//Update default keywords data every day
export async function GET() {
  try {
    await dbConnect();
    const count = await Keyword.countDocuments();

    if (count === 0) {
      await seedInitialKeywords();
      return NextResponse.json({
        message:
          'There are no keywords. Default keywords are seeding by cron job ',
      });
    } else {
      const existDefaultKeywords = await Keyword.find({
        isDefaultKeywords: true,
      });

      if (existDefaultKeywords?.length) {
        for (let i = 0; i < existDefaultKeywords.length; i++) {
          const updateKeywordSearch = await searchKeyword(
            existDefaultKeywords[i].term,
            existDefaultKeywords[i].location,
            existDefaultKeywords[i].device
          );
          const updateKeywordData = getKeywordData(updateKeywordSearch, {
            isDefaultKeywords: true,
          });
          await Keyword.findOneAndUpdate(
            { _id: existDefaultKeywords[i]._id },
            updateKeywordData,
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true,
            }
          );
        }
        return NextResponse.json({
          message: 'Default keywords daily update is done.',
        });
      }
      return NextResponse.json({ message: 'There are no default keywords' });
    }
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}
