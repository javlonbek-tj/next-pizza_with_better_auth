import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';
import { ProductFormValues } from '@/components/admin/schemas/product-schema';
import { ProductWithRelations } from '@/types';

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
