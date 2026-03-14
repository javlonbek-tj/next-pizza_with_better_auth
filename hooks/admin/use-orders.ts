import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const QUERY_KEY = ['admin', 'orders'];

export interface OrderRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  comment: string | null;
  totalAmount: number;
  deliveryPrice: number;
  status: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    ingredients: unknown[];
    productItem: {
      product: {
        name: string;
        imageUrl: string;
      };
    };
  }[];
}

export function useOrders(
  params: { page?: number; limit?: number; status?: string; search?: string },
  options?: { refetchInterval?: number },
) {
  return useQuery<{ data: OrderRow[]; total: number }>({
    queryKey: [...QUERY_KEY, params],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params.page) sp.set('page', String(params.page));
      if (params.limit) sp.set('limit', String(params.limit));
      if (params.status) sp.set('status', params.status);
      if (params.search) sp.set('search', params.search);

      const res = await fetch(`/api/admin/orders?${sp}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
    ...options,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/orders/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: payload.status }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Статус заказа обновлён');
    },
    onError: () => {
      toast.error('Не удалось обновить статус');
    },
  });
}
