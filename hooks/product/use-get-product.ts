import { Api } from '@/services/api-client';
import { useQuery } from '@tanstack/react-query';

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => Api.products.getProduct(id),
    enabled: !!id,
  });
}
