'use client';

import { mapPizzaType, PizzaSize } from '../../constants/pizza';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { pizzaSizes, PizzaType } from '@/constants/pizza';
import { Variant } from '../product/Group-variants';
import { useSet } from 'react-use';
import { useState } from 'react';
import { totalPizzaPrice } from '@/lib/product';

interface ReturnProps {
  type: PizzaType;
  setType: (type: PizzaType) => void;
  size: PizzaSize;
  setSize: (size: PizzaSize) => void;
  allPizzaSizes: Variant[];
  selectedIngredients: Set<string>;
  addIngredient: (id: string) => void;
  description: string;
  hasValidPizzaItems: boolean;
  error?: string;
  selectedPizzaItemId: string | null;
  totalPrice: number;
}

export const usePizzaOptions = (product: ProductWithRelations): ReturnProps => {
  const validPizzaItems = product.productItems.filter(
    (item) => item.pizzaType !== null && item.size !== null
  );

  const hasValidPizzaItems = validPizzaItems.length > 0;

  const firstValidItem = validPizzaItems[0];
  const defaultType = (firstValidItem?.pizzaType as PizzaType) ?? 1;
  const defaultSize = (firstValidItem?.size as PizzaSize) ?? 20;

  const [type, setType] = useState<PizzaType>(defaultType);
  const [size, setSize] = useState<PizzaSize>(defaultSize);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<string>([])
  );

  const availableSizes = validPizzaItems
    .filter((item) => item.pizzaType === type)
    .map((item) => {
      return { size: item.size as number };
    });

  const handleTypeChange = (newType: PizzaType) => {
    const newAvailableSizes = validPizzaItems
      .filter((item) => item.pizzaType === newType)
      .map((item) => ({ size: item.size as number }));

    const isCurrentSizeAvailable = newAvailableSizes.find(
      (item) => item.size === size
    );

    setType(newType);
    if (!isCurrentSizeAvailable && newAvailableSizes.length > 0) {
      setSize(newAvailableSizes[0].size as PizzaSize);
    }
  };

  const allPizzaSizes = pizzaSizes.map(({ name, value }): Variant => {
    return {
      name,
      value,
      disabled: !availableSizes.some((item) => item.size === value),
    };
  });

  // Create description with fallbacks
  const description = hasValidPizzaItems
    ? `${size} см, ${mapPizzaType[type]} пицца`
    : 'Конфигурация недоступна';

  // Determine error message
  let error: string | undefined;
  if (!hasValidPizzaItems) {
    error = 'У этого продукта отсутствуют корректные варианты размера и типа';
  }

  const selectedPizzaItemId =
    validPizzaItems.find(
      (item) => item.size === size && item.pizzaType === type
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
    selectedIngredients,
    addIngredient,
    description,
    hasValidPizzaItems,
    error,
    selectedPizzaItemId,
    totalPrice,
  };
};
