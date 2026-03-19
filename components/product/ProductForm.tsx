'use client';

import { useRouter } from 'next/navigation';
import { PizzaFormWrapper } from './PizzaFormWrapper';
import { ProductFormWrapper } from './ProductFormWrapper';
import type { PizzaSize, PizzaType, ProductWithCategory } from '@/types';
import { ProductNotFound } from './ProductNotFound';

interface Props {
  product: ProductWithCategory | null;
  isModal: boolean;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
}

export function ProductForm({
  product,
  isModal,
  pizzaSizes,
  pizzaTypes,
}: Props) {
  const router = useRouter();

  if (!product) {
    return (
      <ProductNotFound
        href='/'
        text='Назад на главную'
        message='Продукт не найден'
      />
    );
  }

  if (product.category?.isPizza) {
    return (
      <PizzaFormWrapper
        product={product}
        isModal={isModal}
        onClose={() => router.back()}
        pizzaSizes={pizzaSizes}
        pizzaTypes={pizzaTypes}
      />
    );
  }

  return (
    <ProductFormWrapper
      product={product}
      isModal={isModal}
      onClose={() => router.back()}
    />
  );
}
