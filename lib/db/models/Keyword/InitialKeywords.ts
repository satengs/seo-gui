import { IKeyword } from '@/types';
import Keyword from './Keyword';
import {searchKeyword} from "@/lib/serpApi";

export const initialKeywords = [
  {
    "term": "freedom debt relief",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "Los Angeles, California, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief",
    "location": "Tempe, Arizona, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "Tempe, Arizona, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief",
    "location": "San Mateo, California, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "San Mateo, California, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief",
    "location": "Houston, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "Houston, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief",
    "location": "Chicago, Illinois, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "Chicago, Illinois, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief",
    "location": "Brooklyn, New York, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "Brooklyn, New York, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief",
    "location": "Las Vegas, Nevada, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "Las Vegas, Nevada, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief",
    "location": "San Antonio, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief",
    "location": "San Antonio, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Los Angeles, California, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Tempe, Arizona, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Tempe, Arizona, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "San Mateo, California, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "San Mateo, California, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Houston, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Houston, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Chicago, Illinois, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Chicago, Illinois, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Brooklyn, New York, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Brooklyn, New York, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Las Vegas, Nevada, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "Las Vegas, Nevada, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "San Antonio, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief reviews",
    "location": "San Antonio, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Los Angeles, California, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Tempe, Arizona, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Tempe, Arizona, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "San Mateo, California, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "San Mateo, California, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Houston, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Houston, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Chicago, Illinois, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Chicago, Illinois, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Brooklyn, New York, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Brooklyn, New York, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Las Vegas, Nevada, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "Las Vegas, Nevada, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "San Antonio, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a scam",
    "location": "San Antonio, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Los Angeles, California, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Tempe, Arizona, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Tempe, Arizona, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "San Mateo, California, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "San Mateo, California, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Houston, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Houston, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Chicago, Illinois, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Chicago, Illinois, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Brooklyn, New York, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Brooklyn, New York, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Las Vegas, Nevada, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "Las Vegas, Nevada, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "San Antonio, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief legit",
    "location": "San Antonio, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "Los Angeles, California, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "Tempe, Arizona, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "Tempe, Arizona, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "San Mateo, California, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "San Mateo, California, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "Houston, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "Houston, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "Chicago, Illinois, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "Chicago, Illinois, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "Brooklyn, New York, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "Brooklyn, New York, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "Las Vegas, Nevada, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "Las Vegas, Nevada, United States",
    "device": "desktop"
  },
  {
    "term": "freedom debt relief company",
    "location": "San Antonio, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "freedom debt relief company",
    "location": "San Antonio, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Los Angeles, California, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Tempe, Arizona, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Tempe, Arizona, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "San Mateo, California, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "San Mateo, California, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Houston, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Houston, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Chicago, Illinois, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Chicago, Illinois, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Brooklyn, New York, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Brooklyn, New York, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Las Vegas, Nevada, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "Las Vegas, Nevada, United States",
    "device": "desktop"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "San Antonio, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "does freedom debt relief hurt your credit",
    "location": "San Antonio, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Los Angeles, California, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Tempe, Arizona, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Tempe, Arizona, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "San Mateo, California, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "San Mateo, California, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Houston, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Houston, Texas, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Chicago, Illinois, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Chicago, Illinois, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Brooklyn, New York, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Brooklyn, New York, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Las Vegas, Nevada, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "Las Vegas, Nevada, United States",
    "device": "desktop"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "San Antonio, Texas, United States",
    "device": "mobile"
  },
  {
    "term": "is freedom debt relief a good idea",
    "location": "San Antonio, Texas, United States",
    "device": "desktop"
  }
] as const;

export const getKeywordData1 = (srcObj: any, existingData: any) => {
  const keywordData: IKeyword = {
    _id: existingData?._id,
    term: srcObj?.search_parameters?.q || srcObj?.term,
    kgmid: srcObj?.knowledge_graph?.kgmid,
    kgmTitle: srcObj?.knowledge_graph?.kgmTitle,
    kgmWebsite: srcObj?.knowledge_graph?.website,
    location: srcObj?.search_parameters?.location_used || 'United States',
    device: srcObj?.search_parameters?.device,
    organicResultsCount: srcObj?.organic_results?.length || 0,
    keywordTerm: existingData?.keywordTerm,
    isDefaultKeywords: existingData?.isDefaultKeywords,
    historicalData: existingData?.historicalData,
    createdAt: existingData?.createdAt,
    updatedAt: existingData?.update,
    keywordData: {
      data: { ...srcObj },
    },
  };
  return keywordData;
};

export async function getKeywordData(term: string, location: string, device: string) {
  try {
    const searchResults:any = await searchKeyword(term, location, device);
    const todayKey = new Date().toISOString().split('T')[0];

    const dailyData = {
      organicResultsCount: searchResults?.search_information?.totalResults || 0,
      kgmid: searchResults?.knowledge_graph?.kgmid || '',
      kgmTitle: searchResults?.knowledge_graph?.title || '',
      kgmWebsite: searchResults?.knowledge_graph?.website || '',
      term,
      device,
      location,
      difficulty: null,
      volume: null,
      backlinksNeeded: null,
      keywordData: {data: {...searchResults}},
      timestamp: new Date().toISOString()
    };

    console.log("________________________", dailyData)
    return {
      ...dailyData,
      historicalData: new Map([[todayKey, dailyData]]),
      isDefaultKeywords: true,
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
                device: keyword.device
              },
              {
                $set: keywordData
              },
              {
                upsert: true,
                new: true
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