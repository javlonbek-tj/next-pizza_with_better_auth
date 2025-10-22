import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';
import { Category, Ingredient } from '@/lib/generated/prisma';
import {
  CategoryFormValues,
  IngredientFormValues,
  PizzaSizeFormValues,
} from '@/components/admin';
import { CategoryWithProductCount } from '@/prisma/@types/prisma';
import { PizzaSize } from '@/lib';

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

export const getPizzaSizes = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<PizzaSize[]>>(
      `${ApiRoutes.ADMIN}/pizza-sizes`
    )
  ).data;

  return data;
};

// ✅ Create pizza size
export const createPizzaSize = async (dto: PizzaSizeFormValues) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<PizzaSize>>(
      `${ApiRoutes.ADMIN}/pizza-sizes`,
      dto
    )
  ).data;

  return data;
};

// ✅ Update pizza size
export const updatePizzaSize = async (id: string, dto: PizzaSizeFormValues) => {
  const { data } = (
    await axiosInstance.put<ApiResponse<PizzaSize>>(
      `${ApiRoutes.ADMIN}/pizza-sizes/${id}`,
      dto
    )
  ).data;

  return data;
};

// ✅ Delete pizza size
export const deletePizzaSize = (id: string) => {
  return axiosInstance.delete(`${ApiRoutes.ADMIN}/pizza-sizes/${id}`);
};
