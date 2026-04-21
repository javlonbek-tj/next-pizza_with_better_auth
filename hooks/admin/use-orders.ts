import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/services/orders';
import type { OrderWithItems } from '@/types';

export type OrderRow = OrderWithItems;

export function useOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  return useQuery<{ orders: OrderWithItems[]; total: number }>({
    queryKey: ['admin', 'orders', params],
    queryFn: () => getOrders(params),
    refetchInterval: 10000,
  });
}
