'use client';

import { useRouter } from 'next/navigation';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { ChoosePizzaForm } from './Choose-pizza-form';
import { ChooseProductForm } from './Choose-product-form';
import { usePizzaOptions, useAddToCart } from '@/hooks';

interface Props {
  product: ProductWithRelations;
  isModal: boolean;
}

export function ProductForm({ product, isModal }: Props) {
  const isPizza = Boolean(product.productItems[0].pizzaType);
  const { selectedPizzaItemId } = usePizzaOptions(product);
  const { mutate: addToCart, isPending } = useAddToCart();
  const router = useRouter();

  async function handleAddToCart() {
    addToCart({
      productItemId: selectedPizzaItemId ?? product.productItems[0].id,
      quantity: 1,
    });
    if (isModal) {
      router.back();
    }
  }

  return isPizza ? (
    <ChoosePizzaForm
      product={product}
      onAddToCart={handleAddToCart}
      isPending={isPending}
      isModal={isModal}
    />
  ) : (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      price={product.productItems[0].price}
      onAddToCart={handleAddToCart}
      isPending={isPending}
      isModal={isModal}
    />
  );
}
