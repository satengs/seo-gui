import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import {
  seedInitialKeywords,
} from '@/lib/db/models/Keyword/InitialKeywords';
import { searchKeyword } from '@/lib/serpApi';
import { SearchKeywordResponse } from '@/lib/types/serp';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayKey = () => {
  return new Date().toISOString().split('T')[0];
};

// Update default keywords data every day
export async function GET() {
  try {
    await dbConnect();
    const count = await Keyword.countDocuments();

    if (count === 0) {
      await seedInitialKeywords();
      return NextResponse.json({
        message: 'There are no keywords. Default keywords are seeding by cron job',
      });
    }

    const existDefaultKeywords = await Keyword.find({
      isDefaultKeywords: true,
    });

    if (!existDefaultKeywords?.length) {
      return NextResponse.json({ message: 'There are no default keywords' });
    }

    const todayKey = getTodayKey();
    const updates = await Promise.all(
        existDefaultKeywords.map(async (keyword) => {
          const updateKeywordSearch = await searchKeyword(
              keyword.term,
              keyword.location,
              keyword.device
          ) as SearchKeywordResponse;

          const dailyData = {
            organicResultsCount: updateKeywordSearch.searchInformation?.totalResults || 0,
            kgmTitle: updateKeywordSearch.knowledgeGraph?.title || '',
            kgmWebsite: updateKeywordSearch.knowledgeGraph?.website || '',
            // Add any other metrics you want to track daily
            timestamp: new Date(),
          };

          // Create new dynamic data entry for today
          const newDynamicData = {
            [todayKey]: dailyData
          };

          // Merge with existing dynamic data if it exists
          const existingDynamicData = keyword.dynamicData?.data || {};
          const updatedDynamicData = {
            ...existingDynamicData,
            ...newDynamicData
          };

          // Update the keyword document
          return Keyword.findByIdAndUpdate(
              keyword._id,
              {
                $set: {
                  'dynamicData.data': updatedDynamicData,
                  updatedAt: new Date()
                }
              },
              {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
              }
          );
        })
    );

    return NextResponse.json({
      message: 'Default keywords daily update is done.',
      updated: updates.length
    });
  } catch (error) {
    console.error('Failed to update keywords:', error);
    return NextResponse.json(
        { error: 'Failed to update keywords' },
        { status: 500 }
    );
  }
}