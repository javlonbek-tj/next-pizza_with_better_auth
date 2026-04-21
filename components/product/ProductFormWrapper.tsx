'use client';

import { useProductDetail } from '@/hooks';
import type { ProductWithCategory } from '@/types';
import { ChooseProductForm } from './ChooseProductForm';

interface Props {
  product: ProductWithCategory;
  isModal: boolean;
  onClose: () => void;
}

export function ProductFormWrapper({ product, isModal, onClose }: Props) {
  const { handleAddToCart, isPending, selectedIngredients, addIngredient, productItemId } =
    useProductDetail(product, onClose, isModal);

  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      price={Number(product.productItems[0].price)}
      productItemId={productItemId}
      onAddToCart={handleAddToCart}
      isPending={isPending}
      isModal={isModal}
      selectedIngredients={selectedIngredients}
      addIngredient={addIngredient}
      ingredients={product.ingredients}
    />
  );
}
