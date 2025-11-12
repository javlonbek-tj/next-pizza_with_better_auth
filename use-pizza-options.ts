'use client';

import { useState } from 'react';
import { useSet } from 'react-use';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { totalPizzaPrice } from '@/lib/product';
import { Variant } from '@/components/product/GroupVariants';
import { PizzaSize, PizzaType } from '@/lib/generated/prisma';
import { useGetPizzaSizes, useGetPizzaTypes } from '../admin';

interface ReturnProps {
  type: PizzaType;
  setType: (type: PizzaType) => void;
  size: PizzaSize;
  setSize: (size: PizzaSize) => void;
  allPizzaSizes: Variant[];
  allPizzaTypes: Variant[];
  selectedIngredients: Set<string>;
  addIngredient: (id: string) => void;
  description: string;
  hasValidPizzaItems: boolean;
  error?: string;
  selectedPizzaItemId: string | null;
  totalPrice: number;
  isPending: boolean;
}

export const usePizzaOptions = (product: ProductWithRelations): ReturnProps => {
  const validPizzaItems = product.productItems.filter(
    (item) => item.typeId !== null && item.sizeId !== null
  );
  const { data: pizzaSizes = [], isPending: isPizzaSizesPending } =
    useGetPizzaSizes();
  const { data: pizzaTypes = [], isPending: isPizzaTypesPending } =
    useGetPizzaTypes();

  const isPending = isPizzaSizesPending || isPizzaTypesPending;

  const hasValidPizzaItems = validPizzaItems.length > 0;
  const firstValidItem = validPizzaItems[0];
  const defaultType = firstValidItem.type as PizzaType;
  const defaultSize = firstValidItem.size as PizzaSize;

  const [type, setType] = useState<PizzaType>(defaultType);
  const [size, setSize] = useState<PizzaSize>(defaultSize);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<string>([])
  );

  const availableSizes = validPizzaItems
    .filter((item) => item.type?.id === type?.id)
    .map((item) => item.size);

  const handleTypeChange = (newType: PizzaType) => {
    const newAvailableSizes = validPizzaItems
      .filter((item) => item.type?.id === newType.id)
      .map((item) => item.size as PizzaSize);

    const isCurrentSizeAvailable = newAvailableSizes.find(
      (s) => s.id === size?.id
    );

    setType(newType);
    if (!isCurrentSizeAvailable && newAvailableSizes.length > 0) {
      setSize(newAvailableSizes[0]);
    }
  };

  const allPizzaSizes = pizzaSizes.map((variant): Variant => {
    return {
      name: variant.label,
      value: variant,
      disabled: !availableSizes.some((size) => size?.id === variant.id),
    };
  });

  const allPizzaTypes = pizzaTypes.map((variant): Variant => {
    return {
      name: variant.type,
      value: variant,
      disabled: !validPizzaItems.some((item) => item.type?.id === variant.id),
    };
  });

  console.log('[VALID PIZZA ITEMS]', validPizzaItems);

  console.log('[type]', type);

  console.log('[size]', size);

  console.log('[ALL PIZZA SIZES]', allPizzaSizes);

  console.log('[ALL PIZZA TYPES]', allPizzaTypes);

  const description = hasValidPizzaItems
    ? `${size?.size} см, ${type?.type} пицца`
    : 'Конфигурация недоступна';

  let error: string | undefined;
  if (!hasValidPizzaItems) {
    error = 'У этого продукта отсутствуют корректные варианты размера и типа';
  }

  const selectedPizzaItemId =
    validPizzaItems.find(
      (item) => item.size?.id === size?.id && item.type?.id === type?.id
    )?.id || null;

  const totalPrice = hasValidPizzaItems
    ? totalPizzaPrice(
        product.productItems,
        product.ingredients,
        type,
        size,
        selectedIngredients
      )
    : 0;

  return {
    type,
    setType: handleTypeChange,
    size,
    setSize,
    allPizzaSizes,
    allPizzaTypes,
    selectedIngredients,
    addIngredient,
    description,
    hasValidPizzaItems,
    error,
    selectedPizzaItemId,
    totalPrice,
    isPending,
  };
};
