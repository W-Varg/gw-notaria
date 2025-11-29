import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

export const paginationParamsFormat = (args: ListFindAllQueryDto, defaultPagination = false) => {
  const { page, size, orderBy, orderDirection } = args || {};

  let skip: number | undefined;
  let take: number | undefined;
  let pagination: any = undefined;
  if (defaultPagination) {
    pagination = { total: 0, page: 0, size: 10, from: 1 };
    skip = 0;
    take = 10;
  }

  if (page !== undefined && size !== undefined) {
    skip = page * size;
    take = size;
    pagination = { total: 0, page, size, from: skip + 1 };
  }

  return {
    skip,
    take,
    orderBy: orderBy ? { [orderBy]: orderDirection || 'asc' } : undefined,
    pagination,
  };
};
