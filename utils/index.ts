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

export const getKeywordHistoricalCols = (data: any) => {
  if (data && Array.isArray(data)) {
    return data.map(entry => {
      if (entry && entry.date) {
        return {
          ...entry,
          keywordData: entry.keywordData || {}
        };
      }
      return entry;
    });
  }
  return [];
};

export const getCsvKeywordData = (keyword: any) => {

  const simpleTypeCos = getSimplyTypeRows(keyword);
  const keywordData = getKeywordDataCols(keyword?.keywordData?.data);
  const historicalData = getKeywordHistoricalCols(keyword.historicalData);

  return {
    ...simpleTypeCos,
    ...keywordData,
    historicalData: historicalData
  };
};

export const getConsistentData = (data: any[]) => {
  const allKeys = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      allKeys.add(key);
    });
  });

  return data.map((row) => {
    const rowWithAllKeys: Record<string, any> = {};
    allKeys.forEach((key) => {
      if (key === 'historicalData') {
        rowWithAllKeys[key] = Array.isArray(row[key]) ? row[key] : [];
      } else {
        // For other keys, use empty object as fallback
        rowWithAllKeys[key] = row[key] !== undefined ? row[key] : {};
      }
    });
    return rowWithAllKeys;
  });
};

export const getCsvKeywordMultiData = (keywords: IKeyword[]) => {
  const csvData = keywords.map((keyword) => {
    return getCsvKeywordData(keyword);
  });
  return getConsistentData(csvData);
};

export const csvParser = (csvData: string, fileName: string, append: boolean = false) => {
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
    csvData = [getCsvKeywordData(keywordOrArr)];
  }

  const processedData = csvData.map((row: Record<string, any>) => {
    const processedRow = { ...row };
    if (Array.isArray(processedRow.historicalData)) {
      // Convert each historical data entry to a string
      processedRow.historicalData = processedRow.historicalData
        .map((entry: any) => JSON.stringify(entry))
        .join('|');
    } else {
      processedRow.historicalData = '';
    }
    return processedRow;
  });

  const parser = new Parser({
    fields: Object.keys(processedData[0] || {}),
    header: true
  });

  const csvContent = parser.parse(processedData);

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'keyword-data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
