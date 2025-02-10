import { IKeyword } from '@/types';
import Keyword from './Keyword';

export const initialKeywords = [
  {
    "term": "freedom debt relief",
    "location": "Los Angeles, California, United States",
    "device": "mobile"
  },
  // ... rest of the keywords array
] as const;

export async function getKeywordData(term: string, location: string, device: string) {
  try {
    const keyword = await Keyword.findOne({
      term,
      location,
      device
    });
    return keyword;
  } catch (error) {
    console.error('Error fetching keyword data:', error);
    return null;
  }
}

export async function seedInitialKeywords() {
  try {
    console.log('Starting to seed initial keywords...');

    const operations = initialKeywords.map(keyword => ({
      updateOne: {
        filter: {
          term: keyword.term,
          location: keyword.location,
          device: keyword.device
        },
        update: {
          $setOnInsert: {
            ...keyword,
            isDefaultKeywords: true,
            historicalData: new Map()
          }
        },
        upsert: true
      }
    }));

    const result = await Keyword.bulkWrite(operations);
    console.log('Initial keywords seeded successfully:', result);

    return result;
  } catch (error) {
    console.error('Error seeding initial keywords:', error);
    throw error;
  }
}