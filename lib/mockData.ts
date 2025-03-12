import { IKeyword } from '@/types';

// @ts-ignore
// @ts-ignore
export const mockKeywords: IKeyword[] = [
  {
    _id: 'mock-1',
    createdAt: new Date().toISOString(),
    device: 'mobile',
    organicResultsCount: 10,
    // @ts-ignore
    keywordData: { _id: 'kd-1', data: { search_information: {} } },
    historicalData: new Map(
      Object.entries({
        '2024-03-20': {
          organicResultsCount: 245000000,
          kgmTitle: 'Digital Marketing',
          kgmWebsite: 'https://example.com/digital-marketing',
          difficulty: 75,
          volume: 135000,
          backlinksNeeded: 120,
          timestamp: new Date().toISOString(),
        },
      })
    ),
    isDefaultKeywords: true,
    keywordTerm: 'digital-marketing-mobile-us',
    location: 'United States',
    term: 'digital marketing',
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-2',
    term: 'seo services',
    location: 'United States',
    device: 'desktop',
    keywordTerm: 'seo-services-desktop-us',
    isDefaultKeywords: true,
    organicResultsCount: 10,
    // @ts-ignore
    keywordData: {},
    historicalData: new Map(
      Object.entries({
        '2024-03-20': {
          organicResultsCount: 89000000,
          kgmTitle: 'SEO Services',
          kgmWebsite: 'https://example.com/seo',
          difficulty: 65,
          volume: 90000,
          backlinksNeeded: 85,
          timestamp: new Date().toISOString(),
        },
      })
    ),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-3',
    term: 'content strategy',
    location: 'United States',
    device: 'mobile',
    keywordTerm: 'content-strategy-mobile-us',
    isDefaultKeywords: false,
    organicResultsCount: 10,
    // @ts-ignore
    keywordData: {},
    historicalData: new Map(
      Object.entries({
        '2024-03-20': {
          organicResultsCount: 156000000,
          kgmTitle: 'Content Strategy',
          kgmWebsite: 'https://example.com/content',
          difficulty: 55,
          volume: 45000,
          backlinksNeeded: 60,
          timestamp: new Date().toISOString(),
        },
      })
    ),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
