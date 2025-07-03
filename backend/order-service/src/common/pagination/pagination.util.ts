import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export async function paginate<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  page: number,
  limit: number
) {
  const [data, totals] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
  return {
    data,
    meta: {
      currentPage: page,
      pageSize: limit,
      totalItems: totals,
      totalPages: Math.ceil(totals / limit)
    }
  };
}
