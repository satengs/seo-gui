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
    flatten: true,
    flattenSeparator: '_',
  });

  return parser.parse(dataForCSV);
}
