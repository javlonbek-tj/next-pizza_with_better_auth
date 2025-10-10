import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { AddToCartDto, CartDto } from './dto/cart.dto';

export const getCart = async () => {
  return (await axiosInstance.get(ApiRoutes.CART)).data;
};

export const updateCartQty = async (id: string, quantity: number) => {
  return (await axiosInstance.patch(`${ApiRoutes.CART}/${id}`, { quantity }))
    .data;
};

export const removeCartItem = async (id: string) => {
  return (await axiosInstance.delete(`${ApiRoutes.CART}/${id}`)).data;
};

export const addToCart = async (dto: AddToCartDto) => {
  return (await axiosInstance.post<CartDto>(ApiRoutes.CART, dto)).data;
};

export const removeCart = async () => {
  return (await axiosInstance.delete(ApiRoutes.CART)).data;
};
