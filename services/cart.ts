import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { ApiResponse } from './api-response';
import { AddToCartDto, CartWithRelations } from '@/types';

export const getCart = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<CartWithRelations>>(ApiRoutes.CART)
  ).data;

  return data;
};

export const updateCartQty = async (id: string, quantity: number) => {
  return (
    await axiosInstance.patch(`${ApiRoutes.CART}/${id}`, {
      quantity,
    })
  ).data;
};

export const removeCartItem = async (id: string) => {
  return (await axiosInstance.delete(`${ApiRoutes.CART}/${id}`)).data;
};

export const addToCart = async (dto: AddToCartDto) => {
  return (
    await axiosInstance.post<ApiResponse<CartWithRelations>>(
      ApiRoutes.CART,
      dto,
    )
  ).data;
};

export const clearCart = async () => {
  return (await axiosInstance.delete(ApiRoutes.CART)).data;
};
