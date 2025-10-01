import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';
import { AddToCartDto, CartDto } from './dto/cart.dto';

export const getCart = async (): Promise<CartDto> => {
  return (await axiosInstance.get<CartDto>(ApiRoutes.CART)).data;
};

export const updateCartQty = async (
  id: number,
  quantity: number
): Promise<CartDto> => {
  return (await axiosInstance.patch(`${ApiRoutes.CART}/${id}`, { quantity }))
    .data;
};

export const removeCartItem = async (id: number): Promise<CartDto> => {
  return (await axiosInstance.delete(`${ApiRoutes.CART}/${id}`)).data;
};

export const addToCart = async (dto: AddToCartDto): Promise<CartDto> => {
  return (await axiosInstance.post<CartDto>(ApiRoutes.CART, dto)).data;
};
