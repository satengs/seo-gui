import { IKeyword } from '@/types';

export const mockKeywords: IKeyword[] = [
    {
        _id: 'mock-1',
        term: 'digital marketing',
        location: 'United States',
        device: 'mobile',
        keyword_term: 'digital-marketing-mobile-us',
        isDefaultKeywords: true,
        historicalData: new Map(Object.entries({
            '2024-03-20': {
                organicResultsCount: 245000000,
                kgmTitle: 'Digital Marketing',
                kgmWebsite: 'https://example.com/digital-marketing',
                difficulty: 75,
                volume: 135000,
                backlinksNeeded: 120,
                timestamp: new Date().toISOString()
            }
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'mock-2',
        term: 'seo services',
        location: 'United States',
        device: 'desktop',
        keyword_term: 'seo-services-desktop-us',
        isDefaultKeywords: true,
        historicalData: new Map(Object.entries({
            '2024-03-20': {
                organicResultsCount: 89000000,
                kgmTitle: 'SEO Services',
                kgmWebsite: 'https://example.com/seo',
                difficulty: 65,
                volume: 90000,
                backlinksNeeded: 85,
                timestamp: new Date().toISOString()
            }
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'mock-3',
        term: 'content strategy',
        location: 'United States',
        device: 'mobile',
        keyword_term: 'content-strategy-mobile-us',
        isDefaultKeywords: false,
        historicalData: new Map(Object.entries({
            '2024-03-20': {
                organicResultsCount: 156000000,
                kgmTitle: 'Content Strategy',
                kgmWebsite: 'https://example.com/content',
                difficulty: 55,
                volume: 45000,
                backlinksNeeded: 60,
                timestamp: new Date().toISOString()
            }
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];