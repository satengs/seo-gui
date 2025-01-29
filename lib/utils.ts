import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IKeyword } from '@/types';
import { Parser } from '@json2csv/plainjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkDateDifference(dateOne: any, dateTwo: any) {
  const msInOneDay = 24 * 60 * 60 * 1000;

  const differenceInMs = Math.abs(dateOne - dateTwo);

  return Math.floor(differenceInMs / msInOneDay);
}

function prepareDataForCSV(keyword: IKeyword): Record<string, any> {
  const baseData = { ...keyword };

  if (baseData.dynamicData && baseData.dynamicData.data) {
    const dynamicFields = baseData.dynamicData.data;
    Object.assign(baseData, dynamicFields);
  }
  delete baseData.dynamicData;

  return baseData;
}

export function generateCSV(keyword: IKeyword): string {
  const dataForCSV = prepareDataForCSV(keyword);

  const parser = new Parser();
  return parser.parse([dataForCSV]);
}

export function generateMultiCSV(keywords: IKeyword[]): string {
  const dataForCSV = keywords.map((keyword) => prepareDataForCSV(keyword));

  const parser = new Parser();
  return parser.parse(dataForCSV);
}
