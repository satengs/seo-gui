import { ISortConfig, ISortObj } from '@/types';
import { DateRange } from 'react-day-picker';

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
  dateRange?: DateRange | any
) => {
  const skip = (page - 1) * pageSize;

  try {
    const regex = new RegExp(term, 'i');
    const fromDate = dateRange?.from ? new Date(dateRange.from) : null;
    const toDate = dateRange?.to ? new Date(dateRange.to) : null;

    const query: any = {};

    if (term) {
      query.$or = [
        { term: { $regex: regex } },
        { location: { $regex: regex } },
        { device: { $regex: regex } },
        { kgmid: { $regex: regex } },
        { kgmTitle: { $regex: regex } }
      ];

      if (term.includes(',')) {
        const tags = term.split(',').map(tag => tag.trim());
        query.$or.push({ tags: { $in: tags } });
      } else {
        query.$or.push({ tags: { $in: [term] } });
      }
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = fromDate;
      if (toDate) query.createdAt.$lte = toDate;
    }

    const sort: ISortObj = {};
    if (sortBy?.sortKey?.length) {
      sort[sortBy.sortKey] = sortBy.sortDirection === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1;
    }

    const pipeline = [
      { $match: query },
      {
        $lookup: {
          from: 'keywordHistoricalData',
          let: { keywordId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$id', '$$keywordId'] },
                    ...(fromDate ? [{ $gte: ['$date', fromDate.toISOString().split('T')[0]] }] : []),
                    ...(toDate ? [{ $lte: ['$date', toDate.toISOString().split('T')[0]] }] : [])
                  ]
                }
              }
            },
            { $sort: { date: -1 } }
          ],
          as: 'historicalData'
        }
      },
      { $sort: sort },
      { $skip: skip },
      { $limit: pageSize }
    ];

    const [entitiesData, totalCount] = await Promise.all([
      schema.aggregate(pipeline),
      schema.countDocuments(query)
    ]);

    return {
      entitiesData,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page
    };
  } catch (err: any) {
    throw new Error('Error fetching paginated data: ' + (err?.message || ''));
  }
};

export const paginateLocationsByFilter = async (
  page: number,
  pageSize: number,
  schema: any,
  location: string,
  sortBy?: ISortConfig
) => {
  const skip = (page - 1) * pageSize;

  try {
    const regex = new RegExp(location, 'i');
    let query = location
      ? {
          $or: [
            { location: { $regex: regex } },
            { countryCode: { $in: [regex] } },
            { longitude: { $regex: regex } },
            { latitude: { $regex: regex } },
          ],
        }
      : {};

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
