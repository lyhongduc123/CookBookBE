// src/common/utils/pagination.util.ts
export interface Pagination {
    page: number;
    limit: number;
  }
  
  export const getPagination = (query: any): Pagination => {
    const page = query.page && query.page > 0 ? +query.page : 1;
    const limit = query.limit && query.limit > 0 ? +query.limit : 10;
    return { page, limit };
  };
  
  export const getPagingData = (data: any, page: number, limit: number) => {
    const { count: totalItems, rows: items } = data;
    const totalPages = Math.ceil(totalItems / limit);
    return { items, totalItems, totalPages, currentPage: page };
  };
  