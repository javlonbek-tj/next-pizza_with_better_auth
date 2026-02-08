import { axiosInstance } from './instance';
import { Order } from '@/lib/generated/prisma';

export const getOrders = async () => {
  const { data } = await axiosInstance.get<Order[]>('/admin/orders');
  return data;
};

export const updateOrderStatus = async (id: string, status: string) => {
  const { data } = await axiosInstance.patch<Order>(`/admin/orders/${id}`, { status });
  return data;
};
