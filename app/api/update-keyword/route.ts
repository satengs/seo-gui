import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { SearchKeywordResponse } from '@/types';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayKey = () => {
    return new Date().toISOString().split('T')[0];
};

export async function GET() {
    try {
        await dbConnect();
        const count = await Keyword.countDocuments();

        if (count === 0) {
            return NextResponse.json({
                message: 'No keywords found in the database',
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
                    difficulty: null,
                    volume: null,
                    backlinksNeeded: null,
                    timestamp: new Date()
                };

                return Keyword.findOneAndUpdate(
                    {
                        term: keyword.term,
                        device: keyword.device,
                        location: keyword.location
                    },
                    {
                        $set: {
                            [`historicalData.${todayKey}`]: dailyData,
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