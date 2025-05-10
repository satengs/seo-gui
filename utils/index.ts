import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IHistoricalMapEntry, IKeyword } from '@/types';
import { Parser } from '@json2csv/plainjs';

export function mergeClassNames(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSimplyTypeRows = (keyword: IKeyword) => {
  const keys = Object.keys(keyword);
  const rows: Array<Record<string, string | number>> = [];
  let data: Record<string, string | number> = {};
  keys.map((key) => {
    if (typeof keyword[key as keyof typeof keyword] !== 'object') {
      rows.push({
        [`${key}`]: keyword[key as keyof typeof keyword],
      });
    }
    if (Array.isArray(keyword[key as keyof typeof keyword])) {
      rows.push({
        [`${key}`]: keyword[key as keyof typeof keyword].join(','),
      });
    }
  });
  rows.map((row) => {
    data = { ...data, ...row };
  });

  return data;
};

export const getKeywordDataCols = (keyword: IKeyword) => {
  if (!keyword || typeof keyword !== 'object') return {};
  let data = {};
  const keys = Object.keys(keyword);
  keys.map((k) => {
    data = { ...data, [`${k}`]: keyword[k as keyof typeof keyword] };
  });
  return data;
};

export const getKeywordHistoricalCols = (data: IHistoricalMapEntry) => {
  if (data && data instanceof Map) {
    let historicalData = {};
    const keys = data.keys();
    for (let key of keys) {
      historicalData = {
        ...historicalData,
        [`${key}.historical`]: data.get(key),
      };
    }
    return historicalData;
  }
  return { historicalData: {} };
};

export const getCsvKeywordData = (keyword: any) => {
  const simpleTypeCos = getSimplyTypeRows(keyword);
  const keywordData = getKeywordDataCols(keyword?.keywordData?.data);
  const historicalData = getKeywordHistoricalCols(keyword.historicalData);
  return { ...simpleTypeCos, ...keywordData, ...historicalData };
};

export const getConsistentData = (data: IKeyword[]) => {
  const allKeys = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      allKeys.add(key);
    });
  });
  return data.map((row) => {
    const rowWithAllKeys: any = {};
    allKeys.forEach((key) => {
      // @ts-ignore
      rowWithAllKeys[key] = row[key] !== undefined ? row[key] : {}; // Fill missing keys with empty string
    });
    return rowWithAllKeys;
  });
};

export const getCsvKeywordMultiData = (keywords: IKeyword[]) => {
  const csvData = keywords.map((keyword) => getCsvKeywordData(keyword));
  const data: IKeyword[] = [];
  for (let k in csvData) {
    // @ts-ignore
    data.push(csvData[k]);
  }
  return getConsistentData(data);
};

export const csvParser = (csvData: string, fileName: string) => {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const generateCsvFile = (keywordOrArr: IKeyword | IKeyword[]) => {
  let csvData;
  if (Array.isArray(keywordOrArr)) {
    csvData = getCsvKeywordMultiData(keywordOrArr);
  } else {
    csvData = getCsvKeywordData(keywordOrArr);
  }

  const parser = new Parser({});
  const csvContent = parser.parse(csvData);
  const result = csvParser(csvContent, 'keyword-data.csv');
  return result;
};
