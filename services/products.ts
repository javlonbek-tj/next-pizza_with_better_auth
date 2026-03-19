import { axiosInstance } from './instance';
import { ApiRoutes } from './apiRoutes';
import { ApiResponse } from './api-response';
import { ProductWithRelations } from '@/types';

export const search = async (query: string) => {
  const { data } = (
    await axiosInstance.get<ApiResponse<ProductWithRelations[]>>(
      `${ApiRoutes.PRODUCTS}/search`,
      {
        params: { query },
      },
    )
  ).data;

  return data;
};

export const getProduct = async (id: string) => {
  const { data } = (
    await axiosInstance.get<ApiResponse<ProductWithRelations>>(
      `${ApiRoutes.PRODUCTS}/${id}`,
    )
  ).data;
  return data;
};
