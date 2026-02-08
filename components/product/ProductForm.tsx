'use client';

import { useRouter } from 'next/navigation';
import { BackButton } from '../shared';
import { ChoosePizzaForm } from './ChoosePizzaForm';
import { ChooseProductForm } from './ChooseProductForm';
import { usePizzaDetail, useProductDetail } from '@/hooks';
import { PizzaSize, PizzaType, ProductWithRelations } from '@/types';

interface Props {
  product: ProductWithRelations | null;
  isModal: boolean;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
}
interface WrapperProps {
  product: ProductWithRelations;
  isModal: boolean;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
  onClose: () => void;
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
      <div className="flex flex-col justify-center items-center gap-4 min-h-[500px]">
        <p className="text-gray-500 text-lg">Продукт не найден</p>
        <BackButton onClick={() => router.back()} />
      </div>
    );
  }

  const isPizza = Boolean(
    product.productItems[0]?.sizeId || product.productItems[0]?.typeId
  );

  if (isPizza) {
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
    <RegularProductFormWrapper
      product={product}
      isModal={isModal}
      onClose={() => router.back()}
    />
  );
}

function PizzaFormWrapper({
  product,
  isModal,
  onClose,
  pizzaSizes,
  pizzaTypes,
}: WrapperProps) {
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
      pizzaSizes={pizzaSizes}
      pizzaTypes={pizzaTypes}
    />
  );
}

function RegularProductFormWrapper({
  product,
  onClose,
  isModal,
}: WrapperProps) {
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
