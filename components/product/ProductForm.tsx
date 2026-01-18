'use client';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { ChoosePizzaForm } from './ChoosePizzaForm';
import { ChooseProductForm } from './ChooseProductForm';
import { usePizzaDetail, useProductDetail } from '@/hooks';
import { PizzaSize, PizzaType } from '@/lib/generated/prisma/browser';

interface Props {
  product?: ProductWithRelations;
  isModal: boolean;
  onClose?: () => void;
  isPending: boolean;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
}
interface WrapperProps {
  product: ProductWithRelations;
  isModal: boolean;
  onClose?: () => void;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
}

export function ProductForm({
  product,
  isModal,
  onClose,
  pizzaSizes,
  pizzaTypes,
}: Props) {
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <p className="text-gray-500">Продукт не найден</p>
      </div>
    );
  }

  const isPizza = Boolean(
    product?.productItems[0]?.sizeId || product?.productItems[0]?.typeId
  );

  if (isPizza) {
    return (
      <PizzaFormWrapper
        product={product}
        isModal={isModal}
        onClose={onClose}
        pizzaSizes={pizzaSizes}
        pizzaTypes={pizzaTypes}
      />
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
  isModal,
  onClose,
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
