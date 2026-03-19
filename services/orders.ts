import { axiosInstance } from './instance';
import { ApiRoutes } from './apiRoutes';
import { ApiResponse } from './api-response';
import type { OrderWithItems } from '@/types';

export const getMyOrders = async (): Promise<OrderWithItems[]> => {
  const { data } = await axiosInstance.get<ApiResponse<OrderWithItems[]>>(
    `${ApiRoutes.ORDERS}`,
  );
  return data.data;
};

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{ orders: OrderWithItems[]; total: number }> => {
  const { data } = await axiosInstance.get<
    ApiResponse<{ orders: OrderWithItems[]; total: number }>
  >(`${ApiRoutes.ADMIN}/orders`, { params });

  return data.data;
};
