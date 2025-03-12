import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IKeyword, IHistoricalEntry } from '@/types';
import { Parser } from '@json2csv/plainjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkDateDifference(dateOne: any, dateTwo: any) {
  const msInOneDay = 24 * 60 * 60 * 1000;

  const differenceInMs = Math.abs(dateOne - dateTwo);

  return Math.floor(differenceInMs / msInOneDay);
}

function formatHistoricalData(
  historicalData: Record<string, IHistoricalEntry>
) {
  if (historicalData) {
    return Object.entries(historicalData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, data]) => ({
        date,
        data,
      }));
  }
}

function prepareDataForCSV(keyword: IKeyword): Record<string, any> {
  return {
    term: keyword.term,
    createdAt: keyword.createdAt,
    updatedAt: keyword.updatedAt,
    device: keyword.device,
    location: keyword.location,
    organicResultsCount: keyword.organicResultsCount,
    kgmTitle: keyword.kgmTitle,
    kgmWebsite: keyword.kgmWebsite,
    kgmid: keyword.kgmid,
    isDefaultKeywords: keyword.isDefaultKeywords,
    keywordData: JSON.stringify(keyword.keywordData),
    historicalData: JSON.stringify(
      formatHistoricalData(keyword.historicalData)
    ),
  };
}

export function generateMultiCSV(keywords: IKeyword[]): string {
  const dataForCSV = keywords.map((keyword) => prepareDataForCSV(keyword));
  const parser = new Parser({
    // @ts-ignore
    flatten: true,
    flattenSeparator: '_',
  });

  return parser.parse(dataForCSV);
}

const CITY_ABBREVIATIONS: Record<string, string> = {
  'los angeles': 'LA', 'new york': 'NYC', 'san francisco': 'SF','san antonio': 'SA',
  'las vegas': 'LV', 'washington': 'DC', 'chicago': 'CHI', 'dallas': 'DAL',
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
  'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
  'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
  'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
  'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
  'new hampshire': 'NH', 'new jersey': 'NJ', 'new mexico': 'NM',
  'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
  'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
  'vermont': 'VT', 'virginia': 'VA', 'west virginia': 'WV',
  'wisconsin': 'WI', 'wyoming': 'WY',
  'united states': 'US', 'united kingdom': 'UK', 'canada': 'CA', 'australia': 'AU',
  'germany': 'DE', 'france': 'FR', 'italy': 'IT', 'spain': 'ES',
  'japan': 'JP', 'china': 'CN'
};

export function shortenLocation(location: string): string {
  if (!location) return '';

  const parts = location.split(', ').map(part => part.toLowerCase().trim());

  let name1 = CITY_ABBREVIATIONS[parts[0]] || parts[0]; // Shorten city if possible.
  let name2 = CITY_ABBREVIATIONS[parts[1]] || parts[1]; // Shorten city if possible.
  let name3 = CITY_ABBREVIATIONS[parts[2]] || parts[2]; // Shorten city if possible.

  // Handle other countries
  return `${name1?.toLowerCase()}, ${name2?.toLowerCase()}, ${name3?.toLowerCase()}`;
}
