import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';
import {
  Category,
  Ingredient,
  PizzaSize,
  PizzaType,
} from '@/lib/generated/prisma/browser';
import {
  CategoryFormValues,
  IngredientFormValues,
  PizzaSizeFormValues,
  PizzaTypeFormValues,
} from '@/components/admin';
import {
  CategoryWithProductCount,
  PizzaSizeWithProductCount,
  PizzaTypeWithProductCount,
  ProductWithRelations,
} from '@/prisma/@types/prisma';
import { ProductFormValues } from '@/components/admin/schemas/product-schema';

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
    await axiosInstance.get<ApiResponse<PizzaSizeWithProductCount[]>>(
      `${ApiRoutes.ADMIN}/pizza-sizes`
    )
  ).data;

  return data;
};

export const createPizzaSize = async (dto: PizzaSizeFormValues) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<PizzaSize>>(
      `${ApiRoutes.ADMIN}/pizza-sizes`,
      dto
    )
  ).data;

  return data;
};

export const updatePizzaSize = async (id: string, dto: PizzaSizeFormValues) => {
  const { data } = (
    await axiosInstance.put<ApiResponse<PizzaSize>>(
      `${ApiRoutes.ADMIN}/pizza-sizes/${id}`,
      dto
    )
  ).data;

  return data;
};

export const deletePizzaSize = (id: string) => {
  return axiosInstance.delete(`${ApiRoutes.ADMIN}/pizza-sizes/${id}`);
};

export const getPizzaTypes = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<PizzaTypeWithProductCount[]>>(
      `${ApiRoutes.ADMIN}/pizza-types`
    )
  ).data;

  return data;
};

export const createPizzaType = async (dto: PizzaTypeFormValues) => {
  const { data } = (
    await axiosInstance.post<ApiResponse<PizzaType>>(
      `${ApiRoutes.ADMIN}/pizza-types`,
      dto
    )
  ).data;

  return data;
};

export const updatePizzaType = async (id: string, dto: PizzaTypeFormValues) => {
  const { data } = (
    await axiosInstance.put<ApiResponse<PizzaType>>(
      `${ApiRoutes.ADMIN}/pizza-types/${id}`,
      dto
    )
  ).data;

  return data;
};

export const deletePizzaType = (id: string) => {
  return axiosInstance.delete(`${ApiRoutes.ADMIN}/pizza-types/${id}`);
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
