'use client';

import { usePizzaDetail } from '@/hooks';
import type { PizzaSize, PizzaType, ProductWithCategory } from '@/types';
import { ChoosePizzaForm } from './ChoosePizzaForm';

interface Props {
  product: ProductWithCategory;
  isModal: boolean;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
  onClose: () => void;
}

export function PizzaFormWrapper({
  product,
  isModal,
  onClose,
  pizzaSizes,
  pizzaTypes,
}: Props) {
  const { pizzaOptions, handleAddToCart, isSubmitting } = usePizzaDetail(
    product,
    onClose,
    isModal,
  );

  return (
    <ChoosePizzaForm
      product={product}
      onAddToCart={handleAddToCart}
      isSubmitting={isSubmitting}
      isModal={isModal}
      pizzaOptions={pizzaOptions}
      pizzaSizes={pizzaSizes}
      pizzaTypes={pizzaTypes}
    />
  );
}
