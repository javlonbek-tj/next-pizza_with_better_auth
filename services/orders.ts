import { axiosInstance } from './instance';
import { OrderModel as Order } from '../lib/generated/prisma/models/Order';
import { CheckoutValues } from '@/components/checkout';

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const { data } = await axiosInstance.get<Order[]>('/admin/orders', {
    params,
  });
  return data;
};

export const createOrder = async (data: CheckoutValues) => {
  const { data: result } = await axiosInstance.post<Order>('/orders', data);
  return result;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data } = await axiosInstance.patch<Order>(`/admin/orders/${id}`, {
    status,
  });
  return data;
};
