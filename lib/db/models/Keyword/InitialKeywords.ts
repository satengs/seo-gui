import Keyword from '../schemas/Keyword';
import { searchKeyword } from '@/lib/serpApi';
import { checkDateDifference } from '@/lib/utils';
import GroupedByLocation from '@/lib/db/models/schemas/GroupedByLocation';
import GroupedByDevice from '@/lib/db/models/schemas/GroupedByDevice';
import GroupedByKeywordTerm from '@/lib/db/models/schemas/GroupedByKeywordTerm';
import { IKeyword } from '@/types';

export const initialKeywords = [
  {
    term: 'freedom debt relief',
    location: 'Los Angeles, California, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'Los Angeles, California, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief',
    location: 'Tempe, Arizona, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'Tempe, Arizona, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief',
    location: 'San M., California, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'San Mateo, California, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief',
    location: 'Houston, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'Houston, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief',
    location: 'Chicago, Illinois, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'Chicago, Illinois, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief',
    location: 'Brooklyn, New York, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'Brooklyn, New York, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief',
    location: 'Las Vegas, Nevada, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'Las Vegas, Nevada, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief',
    location: 'San Antonio, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief',
    location: 'San Antonio, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Los Angeles, California, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Los Angeles, California, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Tempe, Arizona, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Tempe, Arizona, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'San Mateo, California, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'San Mateo, California, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Houston, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Houston, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Chicago, Illinois, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Chicago, Illinois, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Brooklyn, New York, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Brooklyn, New York, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Las Vegas, Nevada, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'Las Vegas, Nevada, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'San Antonio, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief reviews',
    location: 'San Antonio, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Los Angeles, California, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Los Angeles, California, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Tempe, Arizona, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Tempe, Arizona, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'San Mateo, California, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'San Mateo, California, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Houston, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Houston, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Chicago, Illinois, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Chicago, Illinois, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Brooklyn, New York, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Brooklyn, New York, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Las Vegas, Nevada, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'Las Vegas, Nevada, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'San Antonio, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a scam',
    location: 'San Antonio, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Los Angeles, California, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Los Angeles, California, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Tempe, Arizona, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Tempe, Arizona, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'San Mateo, California, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'San Mateo, California, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Houston, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Houston, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Chicago, Illinois, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Chicago, Illinois, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Brooklyn, New York, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Brooklyn, New York, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Las Vegas, Nevada, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'Las Vegas, Nevada, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'San Antonio, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief legit',
    location: 'San Antonio, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'Los Angeles, California, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'Los Angeles, California, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'Tempe, Arizona, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'Tempe, Arizona, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'San Mateo, California, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'San Mateo, California, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'Houston, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'Houston, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'Chicago, Illinois, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'Chicago, Illinois, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'Brooklyn, New York, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'Brooklyn, New York, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'Las Vegas, Nevada, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'Las Vegas, Nevada, United States',
    device: 'desktop',
  },
  {
    term: 'freedom debt relief company',
    location: 'San Antonio, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'freedom debt relief company',
    location: 'San Antonio, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Los Angeles, California, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Los Angeles, California, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Tempe, Arizona, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Tempe, Arizona, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'San Mateo, California, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'San Mateo, California, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Houston, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Houston, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Chicago, Illinois, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Chicago, Illinois, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Brooklyn, New York, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Brooklyn, New York, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Las Vegas, Nevada, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'Las Vegas, Nevada, United States',
    device: 'desktop',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'San Antonio, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'does freedom debt relief hurt your credit',
    location: 'San Antonio, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Los Angeles, California, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Los Angeles, California, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Tempe, Arizona, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Tempe, Arizona, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'San Mateo, California, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'San Mateo, California, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Houston, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Houston, Texas, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Chicago, Illinois, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Chicago, Illinois, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Brooklyn, New York, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Brooklyn, New York, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Las Vegas, Nevada, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'Las Vegas, Nevada, United States',
    device: 'desktop',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'San Antonio, Texas, United States',
    device: 'mobile',
  },
  {
    term: 'is freedom debt relief a good idea',
    location: 'San Antonio, Texas, United States',
    device: 'desktop',
  },
] as const;

export async function getKeywordData(
  term: string,
  location: string,
  device: string,
  newKeyword?: boolean,
  isDefaultKeyword?: boolean
) {
  try {
    const searchResults: any = await searchKeyword({
      keyword: term,
      location,
      device,
    });
    const todayKey = new Date().toISOString().split('T')[0];

    const dailyData = {
      organicResultsCount: searchResults?.organic_results?.length || 0,
      kgmid: searchResults?.knowledge_graph?.kgmid || '',
      kgmTitle: searchResults?.knowledge_graph?.title || '',
      kgmWebsite: searchResults?.knowledge_graph?.website || '',
      totalResultsCount:
        searchResults?.search_information?.total_results?.length || 0,
      term,
      device,
      location,
      difficulty: null,
      volume: null,
      backlinksNeeded: null,
      keywordData: { data: { ...searchResults } },
      timestamp: new Date().toISOString(),
      historicalData: {},
    };

    return {
      ...dailyData,
      historicalData: newKeyword ? null : new Map([[todayKey, dailyData]]),
      isDefaultKeywords: isDefaultKeyword || false,
    };
  } catch (error) {
    console.error(`Error fetching keyword data for ${term}:`, error);
    return null;
  }
}

export async function seedInitialKeywords() {
  try {
    console.log('Starting to seed initial keywords...');
    const results = [];

    for (const keyword of initialKeywords) {
      try {
        const keywordData = await getKeywordData(
          keyword.term,
          keyword.location,
          keyword.device
        );

        if (keywordData) {
          const result = await Keyword.findOneAndUpdate(
            {
              term: keyword.term,
              location: keyword.location,
              device: keyword.device,
            },
            {
              $set: keywordData,
            },
            {
              upsert: true,
              new: true,
            }
          );
          results.push(result);
        }
      } catch (error) {
        console.error(`Error processing keyword ${keyword.term}:`, error);
      }
    }

    console.log(`Successfully seeded ${results.length} keywords`);
    return results;
  } catch (error) {
    console.error('Error seeding initial keywords:', error);
    throw error;
  }
}

export async function findAndUpdateDailyKeyword({
  keyword,
  device,
  location,
  isDefaultKeywords,
}: {
  keyword: string;
  device: string;
  location: string;
  isDefaultKeywords: boolean;
}) {
  const existKeyword = await Keyword.findOne({
    term: keyword,
    location: location,
    device: device,
  });
  if (existKeyword) {
    const dateDiff = checkDateDifference(new Date(), existKeyword.updatedAt);

    if (dateDiff >= 1) {
      const updatedKeywordData = await getKeywordData(
        keyword,
        location,
        device
      );

      if (updatedKeywordData) {
        await Keyword.findOneAndUpdate(
          {
            term: keyword,
            location: location,
            device: device,
          },
          {
            $set: updatedKeywordData,
          },
          { new: true, runValidators: true }
        );
      }
    }
  } else {
    const newKeywordData = await getKeywordData(
      keyword,
      location,
      device,
      true,
      isDefaultKeywords
    );
    const createdKeyword = await Keyword.create(newKeywordData);
    await syncGroupedCollections(createdKeyword);
  }
}

function normalize(value: string) {
  return value
    .split(',')
    .map((v) => v.trim())
    .join(',');
}

export const syncGroupedCollections = async (doc: IKeyword) => {
  const normalizedLocation = normalize(doc.location);
  await Promise.all([
    GroupedByLocation.create({
      keywordId: doc._id,
      keywordTerm: doc.term,
      device: doc.device,
      locationGroup: normalizedLocation,
      createdAt: doc.createdAt,
    }),
    GroupedByDevice.create({
      keywordId: doc._id,
      keywordTerm: doc.term,
      deviceGroup: doc.device,
      location: doc.location,
      createdAt: doc.createdAt,
    }),
    GroupedByKeywordTerm.create({
      keywordId: doc._id,
      keywordTerm: doc.term,
      termGroup: doc.term,
      device: doc.device,
      location: doc.location,
      createdAt: doc.createdAt,
    }),
  ]);
};
