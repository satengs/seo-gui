import { IHistoricalMapEntry, IKeyword, ISortConfig, ISortObj } from '@/types';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export const paginateEntities = async (
  page: number,
  pageSize: number,
  schema: any
) => {
  const skip = (page - 1) * pageSize;

  try {
    const entitiesData = await schema
      .find()
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    const totalCount = await schema.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      entitiesData,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (err: any) {
    throw new Error('Error fetching paginated data: ' + err?.message || '');
  }
};

export const paginateEntitiesByFilterEx = async (
  page: number,
  pageSize: number,
  schema: any,
  term: string,
  sortBy?: ISortConfig
) => {
  const skip = (page - 1) * pageSize;

  try {
    const regex = new RegExp(term, 'i');
    const query = term ? { term: { $regex: regex } } : {};
    const sort: ISortObj = {};
    if (sortBy?.sortKey?.length) {
      sort[`${sortBy.sortKey}`] = sortBy.sortDirection === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }
    const entitiesData = await schema
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .sort(sort);

    const totalCount = await schema.countDocuments({ term: { $regex: regex } });
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      entitiesData,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (err: any) {
    throw new Error('Error fetching paginated data: ', err?.message || '');
  }
};

export const paginateEntitiesByFilter = async (
  page: number,
  pageSize: number,
  schema: any,
  term: string,
  sortBy?: ISortConfig,
  dateRange?: DateRange
) => {
  const skip = (page - 1) * pageSize;

  try {
    const regex = new RegExp(term, 'i');
    let query = term ? { term: { $regex: regex } } : {};
    const sort: ISortObj = {};
    if (sortBy?.sortKey?.length) {
      sort[`${sortBy.sortKey}`] = sortBy.sortDirection === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    if (dateRange?.from && dateRange?.to) {
      const fromDate = format(dateRange.from, 'yyyy-MM-dd');
      const toDate = format(dateRange.to, 'yyyy-MM-dd');

      const allEntities = await schema.find(query).sort(sort);
      const filteredKeywords: IKeyword[] = [];
      allEntities.forEach((keyword: IKeyword) => {
        if (keyword.historicalData) {
          const historicalKeys: string[] = [];
          for (let k of keyword.historicalData.keys()) {
            historicalKeys.push(k);
          }
          let historicalMap: Record<string, IHistoricalMapEntry> = {};
          historicalKeys.forEach((key: string) => {
            if (key >= fromDate && key <= toDate) {
              const timestampKeyword = keyword.historicalData.get(`${key}`);
              historicalMap = { ...historicalMap, [key]: timestampKeyword };
            }
          });

          if (Object.keys(historicalMap)?.length) {
            filteredKeywords.push({
              ...keyword[`_doc`],
              historicalData: historicalMap,
            });
          }
        }
      });

      const startIndex = skip;
      const endIndex = startIndex + pageSize;
      const paginatedEntities = filteredKeywords.slice(startIndex, endIndex);
      return {
        entitiesData: paginatedEntities,
        totalCount: filteredKeywords.length,
        totalPages: Math.ceil(filteredKeywords.length / pageSize),
        currentPage: page,
      };
    }

    const entitiesData = await schema
      .find(query)
      .skip(skip)
      .limit(pageSize)
      .sort(sort);

    const totalCount = await schema.countDocuments(query);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      entitiesData,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (err: any) {
    throw new Error('Error fetching paginated data: ' + (err?.message || ''));
  }
};
