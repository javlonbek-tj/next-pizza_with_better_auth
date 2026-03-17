'use client';

import { useRouter } from 'next/navigation';
import { BackButton } from '../shared';
import { PizzaFormWrapper } from './PizzaFormWrapper';
import { ProductFormWrapper } from './ProductFormWrapper';
import type { PizzaSize, PizzaType, ProductWithCategory } from '@/types';

interface Props {
  product: ProductWithCategory | null;
  isModal: boolean;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
}

export function ProductForm({ product, isModal, pizzaSizes, pizzaTypes }: Props) {
  const router = useRouter();

  if (!product) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 min-h-lg'>
        <p className='text-lg text-gray-500'>Продукт не найден</p>
        <BackButton />
      </div>
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
