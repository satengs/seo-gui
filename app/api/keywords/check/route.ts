import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import DailyRun from '@/lib/db/models/DailyRun';
import { searchKeyword } from '@/lib/serpApi';

export async function POST() {
  try {
    await dbConnect();
    const keywords = await Keyword.find();
    const results = [];

    for (const keyword of keywords) {
      try {
        // const searchResults = await searchKeyword(keyword.term)
        const searchResults: any[] = [];

        // Find our position in the results
        const ranking =
          searchResults.findIndex((result) =>
            result.link.includes('freedomdebtrelief.com')
          ) + 1 || null;

        // Create a daily run record
        const dailyRun = await DailyRun.create({
          keyword: keyword._id,
          ranking,
          impressions: searchResults.length,
          ctr: ranking ? (1 / ranking) * 100 : 0,
        });

        // Update keyword with latest results
        await Keyword.findByIdAndUpdate(keyword._id, {
          lastResults: searchResults,
          lastChecked: new Date(),
        });

        results.push({ keyword: keyword.term, ranking, dailyRun });
      } catch (error) {
        console.error(`Failed to check keyword ${keyword.term}:`, error);
        results.push({ keyword: keyword.term, error: 'Failed to check' });
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to check keywords:', error);
    return NextResponse.json(
      { error: 'Failed to check keywords' },
      { status: 500 }
    );
  }
}
