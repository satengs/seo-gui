export const paginateEntities = async (
  page: number,
  pageSize: number,
  schema: any
) => {
  const skip = (page - 1) * pageSize;

  try {
    const entitiesData = await schema.find().skip().limit(pageSize);
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
