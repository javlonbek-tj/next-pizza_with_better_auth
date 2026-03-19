import { useQuery } from '@tanstack/react-query';
import { Api } from '@/services/api-client';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => Api.orders.getMyOrders(),
  });
};
