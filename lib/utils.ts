import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IKeyword, IHistoricalEntry } from '@/types';
import { Parser } from '@json2csv/plainjs';
import { DataType } from '@/consts/dataTypes';

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
  const parser = new Parser({});

  return parser.parse(dataForCSV);
}

const CITY_ABBREVIATIONS: Record<string, string> = {
  'los angeles': 'LA',
  'new york': 'NY',
  'san francisco': 'SF',
  'san antonio': 'SA',
  'san mateo': 'SM',
  'las vegas': 'LV',
  houston: 'Hou',
  washington: 'DC',
  chicago: 'CHI',
  dallas: 'DAL',
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  brooklyn: 'BK',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
  'united states': 'US',
  'united kingdom': 'UK',
  canada: 'CA',
  australia: 'AU',
  germany: 'DE',
  france: 'FR',
  italy: 'IT',
  spain: 'ES',
  japan: 'JP',
  china: 'CN',
};

export const capitalizeFirstLetter = (value: string) => {
  if (value) {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return '';
};

export function shortenLocation(location: string): string {
  if (!location) return '';

  const parts = location.split(',').map((part) => part.toLowerCase().trim());

  let name1 =
    CITY_ABBREVIATIONS[parts[0]] ||
    (parts[0] && capitalizeFirstLetter(parts[0])); // Shorten city if possible.
  let name2 =
    CITY_ABBREVIATIONS[parts[1]] ||
    (parts[1] && parts[1] && capitalizeFirstLetter(parts[1])); // Shorten city if possible.
  let name3 =
    CITY_ABBREVIATIONS[parts[2]] ||
    (parts[2] && parts[2] && capitalizeFirstLetter(parts[2])); // Shorten city if possible.

  let locationString = '';
  if (name1) {
    locationString += name1;
  }
  if (name2) {
    locationString += ` , ${name2}`;
  }
  if (name3) {
    locationString += ` , ${name3}`;
  }
  // Handle other countries
  return locationString;
}
export function filterKeywordsByType(keywords: any[], type: DataType) {
  return keywords?.filter((item) => {
    if (!item.historicalData || !Array.isArray(item.historicalData))
      return false;

    const entries = item.historicalData;

    switch (type) {
      case 'ai_overview':
        return entries.map((entry: any) => entry?.keywordData?.ai_overview);

      case 'related_questions':
        return entries.map(
          (entry: any) =>
            Array.isArray(entry?.keywordData?.related_questions) ||
            typeof entry?.keywordData?.related_questions === 'object'
        );

      case 'reddit':
        return entries.map(
          (entry: any) =>
            Array.isArray(entry?.keywordData?.organic_results) &&
            entry?.keywordData?.organic_results.some(
              (r: any) =>
                typeof r?.source === 'string' &&
                /\breddit\b/i.test(r.source.toLowerCase())
            )
        );

      case 'inline_videos':
        return entries.map((entry: any) =>
          Array.isArray(entry?.keywordData?.inline_videos)
        );

      case 'knowledge_graph':
        return entries.map((entry: any) => entry?.keywordData?.knowledge_graph);
      case 'discussions_and_forums':
        return entries.map(
          (entry: any) => entry?.keywordData?.discussions_and_forums
        );

      default:
        return false;
    }
  });
}
