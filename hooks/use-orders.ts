import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Api from '@/services/orders';
import { CheckoutValues } from '@/components/checkout';

export const useOrders = (
  params?: { page?: number; limit?: number; status?: string },
  options?: { refetchInterval?: number | false },
) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => Api.getOrders(params),
    ...options,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: CheckoutValues) => Api.createOrder(data),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      Api.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
