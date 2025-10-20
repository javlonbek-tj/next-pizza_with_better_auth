import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';
import { Category, Ingredient } from '@/lib/generated/prisma';
import { CategoryFormValues, IngredientFormValues } from '@/components/admin';
import { CategoryWithProductCount } from '@/prisma/@types/prisma';

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

export const getIngredients = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<Ingredient[]>>(ApiRoutes.INGREDIENTS)
  ).data;
  return data;
};

export const createIngredient = async (dto: IngredientFormValues) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<Ingredient>>(
      `${ApiRoutes.ADMIN}/ingredients`,
      dto
    )
  ).data;
  return data;
};

export const updateIngredient = async (
  id: string,
  dto: IngredientFormValues
) => {
  const { data } = (
    await axiosInstance.put<ApiResponse<Ingredient>>(
      `${ApiRoutes.ADMIN}/ingredients/${id}`,
      dto
    )
  ).data;
  return data;
};

export const deleteIngredient = async (id: string) => {
  return await axiosInstance.delete(`${ApiRoutes.ADMIN}/ingredients/${id}`);
};

export const uploadImage = async (formData: FormData) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<{ imageUrl: string }>>(
      `${ApiRoutes.ADMIN}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  ).data;
  return data;
};
