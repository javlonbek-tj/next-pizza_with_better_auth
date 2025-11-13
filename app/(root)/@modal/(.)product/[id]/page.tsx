'use client';

import { use } from 'react';
import { ChooseProductModal } from '@/components/modals';
import { useGetPizzaSizes, useGetPizzaTypes, useGetProduct } from '@/hooks';

export default function ProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: product, isPending: isProductPending } = useGetProduct(id);
  const { data: pizzaSizes = [], isPending: isPizzaSizesPending } =
    useGetPizzaSizes();
  const { data: pizzaTypes = [], isPending: isPizzaTypesPending } =
    useGetPizzaTypes();

  const isPending =
    isProductPending || isPizzaSizesPending || isPizzaTypesPending;

  return (
    <ChooseProductModal
      product={product}
      isPending={isPending}
      pizzaSizes={pizzaSizes}
      pizzaTypes={pizzaTypes}
    />
  );
}
