import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Api } from '@/services/api-client';
import { getCartDetails } from '@/lib/cart';
import { queryKeys } from '@/lib/constants';
import { AddToCartDto } from '@/types/cart';
import { sleep } from '@/lib';

export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    retry: false,
    queryFn: async () => {
      const data = await Api.cart.getCart();
      return getCartDetails(data);
    },
  });
}

type UpdateQtyVars = { id: string; quantity: number };

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.cart,
    mutationFn: (vars: UpdateQtyVars) =>
      Api.cart.updateCartQty(vars.id, vars.quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}

type RemoveCartItemVars = { id: string };

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.cart,
    mutationFn: async ({ id }: RemoveCartItemVars) => {
      await sleep(2000);
      await Api.cart.removeCartItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: () => {
      toast.error('Не удалось удалить товар из корзины');
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: queryKeys.cart,
    mutationFn: () => Api.cart.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
    onError: () => {
      toast.error('Не удалось очистить корзину');
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.cart,
    mutationFn: (vars: AddToCartDto) => Api.cart.addToCart(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      toast.success('Товар добавлен в корзину 🛒');
    },
    onError: () => {
      toast.error('Не удалось добавить в корзину');
    },
  });
}
