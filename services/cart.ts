import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { AddToCartDto, CartDto } from './dto/cart.dto';
import { ApiResponse } from './api-response';

export const getCart = async () => {
  const { data } = (
    await axiosInstance.get<ApiResponse<CartDto>>(ApiRoutes.CART)
  ).data;

  console.log('🚀 ~ getCart ~ data:', data);

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
  return (await axiosInstance.post<CartDto>(ApiRoutes.CART, dto)).data;
};

export const clearCart = async () => {
  return (await axiosInstance.delete(ApiRoutes.CART)).data;
};
