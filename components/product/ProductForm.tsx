'use client';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { ChoosePizzaForm } from './ChoosePizzaForm';
import { ChooseProductForm } from './ChooseProductForm';
import { usePizzaDetail, useProductDetail } from '@/hooks';

interface Props {
  product: ProductWithRelations;
  isModal: boolean;
  onClose?: () => void;
}

export function ProductForm({ product, isModal, onClose }: Props) {
  const isPizza = Boolean(
    product.productItems[0]?.sizeId || product.productItems[0]?.typeId
  );

  if (isPizza) {
    return (
      <PizzaFormWrapper product={product} isModal={isModal} onClose={onClose} />
    );
  }

  return (
    <RegularProductFormWrapper
      product={product}
      isModal={isModal}
      onClose={onClose}
    />
  );
}

function PizzaFormWrapper({ product, isModal, onClose }: Props) {
  const { pizzaOptions, handleAddToCart, isSubmitting } = usePizzaDetail(
    product,
    onClose,
    isModal
  );

  return (
    <ChoosePizzaForm
      product={product}
      onAddToCart={handleAddToCart}
      isSubmitting={isSubmitting}
      isModal={isModal}
      pizzaOptions={pizzaOptions}
    />
  );
}

function RegularProductFormWrapper({ product, isModal, onClose }: Props) {
  const { handleAddToCart, isPending, selectedIngredients, addIngredient } =
    useProductDetail(product, onClose, isModal);

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      price={product.productItems[0].price}
      onAddToCart={handleAddToCart}
      isPending={isPending}
      isModal={isModal}
      selectedIngredients={selectedIngredients}
      addIngredient={addIngredient}
      ingredients={product.ingredients}
    />
  );
}
