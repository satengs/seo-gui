import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Keyword from '@/lib/db/models/Keyword/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { SearchKeywordResponse } from '@/types';

const extractTotalResults = (searchResults: SearchKeywordResponse): number => {
  if (searchResults.organic_results?.length) {
    return searchResults.organic_results.length;
  }
  return 0;
};
export async function POST() {
  try {
    await dbConnect();
    console.log('Fetching default keywords...');
    const keywords = await Keyword.find({ isDefaultKeywords: true });

    if (!keywords.length) {
      return NextResponse.json({
        message: 'No default keywords found',
        results: [],
      });
    }

    const results = [];
    const todayKey = new Date().toISOString().split('T')[0];

    for (const keyword of keywords) {
      try {
        console.log(`Searching keyword: ${keyword.term}`);
        const searchResults = (await searchKeyword(
          keyword.term,
          keyword.location,
          keyword.device
        )) as SearchKeywordResponse;

        console.log({ searchResults });
        if (searchResults.error) {
          results.push({
            keyword: keyword.term,
            error: `SERP API error: ${searchResults.error}`,
          });
          continue;
        }

        // Create daily metrics data
        const dailyData = {
          organicResultsCount:
            searchResults.search_information?.total_results || 0,
          kgmid: searchResults?.knowledge_graph?.kgmid || '',
          kgmTitle: searchResults.knowledge_graph?.title || '',
          kgmWebsite: searchResults.knowledge_graph?.website || '',
          difficulty: null,
          volume: null,
          term: keyword.term,
          device: keyword.device,
          location: keyword.location,
          backlinksNeeded: null,
          timestamp: new Date().toISOString(),
          'keywordData.data': { ...searchResults },
        };

        // Update keyword with latest results
        await Keyword.findByIdAndUpdate(
          keyword._id,
          {
            $set: {
              [`historicalData.${todayKey}`]: dailyData,
              kgmid: searchResults.knowledge_graph?.kgmid || '',
              kgmTitle: searchResults.knowledge_graph?.title || '',
              kgmWebsite: searchResults.knowledge_graph?.website || '',
              organicResultsCount: extractTotalResults(searchResults),
              'keywordData.data': { ...searchResults },
              updatedAt: new Date(),
            },
          },
          { new: true }
        );

        results.push({
          keyword: keyword.term,
          success: true,
          dailyData,
        });
      } catch (error) {
        console.error(`Failed to check keyword ${keyword.term}:`, error);
        results.push({
          keyword: keyword.term,
          error: 'Failed to check keyword',
        });
      }
    }

    return NextResponse.json({
      message:
        `Successfully checked ${results.filter((r) => !r.error).length} keywords. ` +
        `Failed: ${results.filter((r) => r.error).length}`,
      results,
    });
  } catch (error) {
    console.error('Failed to check keywords:', error);
    return NextResponse.json(
      { error: 'Failed to check keywords' },
      { status: 500 }
    );
  }
}
