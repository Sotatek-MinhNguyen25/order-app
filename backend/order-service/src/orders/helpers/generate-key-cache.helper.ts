import { GetListDto } from "../dto/get-list.dto";

export const GenerateKeyCacheHelper = (dto: GetListDto) => {
  const { search = "", status = "", limit, page, sortBy, sortOrder } = dto;
  return `order:list:search=${search}&status=${status}&limit=${limit}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
};
