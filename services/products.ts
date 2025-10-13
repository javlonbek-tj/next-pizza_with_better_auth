import { Product } from '@/lib/generated/prisma/client';
import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';

export const search = async (query: string) => {
  const { data } = (
    await axiosInstance.get<ApiResponse<Product[]>>(ApiRoutes.SEARCH_PRODUCTS, {
      params: { query },
    })
  ).data;

  return data;
};
