import { axiosInstance } from './instance';
import { ApiRoutes } from './apiRoutes';
import { ApiResponse } from './api-response';
import { ProductWithRelations } from '@/types';
import { ProductFormValues } from '@/lib';

export const getProducts = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<ProductWithRelations[]>>(
      `${ApiRoutes.ADMIN}/products`,
    )
  ).data;

  return data;
};

export const createProduct = async (dto: ProductFormValues) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<ProductWithRelations>>(
      `${ApiRoutes.ADMIN}/products`,
      dto,
    )
  ).data;

  return data;
};

export const deleteProduct = (id: string) => {
  return axiosInstance.delete(`${ApiRoutes.ADMIN}/products/${id}`);
};

export const updateProduct = async (
  productId: string,
  dto: ProductFormValues,
) => {
  const { data } = (
    await axiosInstance.put<ApiResponse<ProductWithRelations>>(
      `${ApiRoutes.ADMIN}/products/${productId}`,
      dto,
    )
  ).data;

  return data;
};
