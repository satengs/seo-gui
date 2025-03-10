import { ISortConfig, ISortObj } from '@/types';

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

export const paginateEntitiesByFilter = async (
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
