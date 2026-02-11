import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';
import { CategoryFormValues } from '@/components/admin';
import { ProductFormValues } from '@/components/admin/schemas/product-schema';
import {
  Category,
  CategoryWithProductCount,
  ProductWithRelations,
} from '@/types';

export const getCategories = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<CategoryWithProductCount[]>>(
      `${ApiRoutes.ADMIN}/categories`
    )
  ).data;

  return data;
};

export const createCategory = async (dto: CategoryFormValues) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<Category>>(
      `${ApiRoutes.ADMIN}/categories`,
      dto
    )
  ).data;

  return data;
};

export const updateCategory = async (id: string, dto: CategoryFormValues) => {
  const { data } = (
    await axiosInstance.put<ApiResponse<Category>>(
      `${ApiRoutes.ADMIN}/categories/${id}`,
      dto
    )
  ).data;

  return data;
};

export const deleteCategory = (id: string) => {
  return axiosInstance.delete(`${ApiRoutes.ADMIN}/categories/${id}`);
};

export const getProducts = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<ProductWithRelations[]>>(
      `${ApiRoutes.ADMIN}/products`
    )
  ).data;

  return data;
};

export const createProduct = async (dto: ProductFormValues) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<ProductWithRelations>>(
      `${ApiRoutes.ADMIN}/products`,
      dto
    )
  ).data;

  return data;
};

export const deleteProduct = (id: string) => {
  return axiosInstance.delete(`${ApiRoutes.ADMIN}/products/${id}`);
};

export const updateProduct = async (
  productId: string,
  dto: ProductFormValues
) => {
  const { data } = (
    await axiosInstance.put<ApiResponse<ProductWithRelations>>(
      `${ApiRoutes.ADMIN}/products/${productId}`,
      dto
    )
  ).data;

  return data;
};
