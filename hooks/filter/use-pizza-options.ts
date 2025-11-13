'use client';

import { useState } from 'react';
import { useSet } from 'react-use';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { totalPizzaPrice } from '@/lib/product';
import { PizzaSize } from '@/lib/generated/prisma';

interface ReturnProps {
  typeId: string;
  setTypeId: (id: string) => void;
  sizeId: string;
  setSizeId: (id: string) => void;
  selectedIngredients: Set<string>;
  addIngredient: (id: string) => void;
  selectedPizzaItemId?: string;
  totalPrice: number;
  availableSizes: Array<PizzaSize | null>;
}

export const usePizzaOptions = (product: ProductWithRelations): ReturnProps => {
  const productItems = product.productItems;

  const cheapestPizzaItem = productItems.reduce((cheapest, current) =>
    current.price < cheapest.price ? current : cheapest
  );

  const defaultTypeId = cheapestPizzaItem?.type?.id as string;
  const defaultSizeId = cheapestPizzaItem?.size?.id as string;

  const [typeId, setTypeId] = useState<string>(defaultTypeId);
  const [sizeId, setSizeId] = useState<string>(defaultSizeId);
  const [selectedIngredients, { toggle: addIngredient }] = useSet(
    new Set<string>([])
  );

  const availableSizes = productItems
    .filter((item) => item.type?.id === typeId)
    .map((item) => item.size);

  const handleTypeChange = (newTypeId: string) => {
    const newAvailableSizes = productItems
      .filter((item) => item.type?.id === newTypeId)
      .map((item) => item.size as PizzaSize);

    const isCurrentSizeAvailable = newAvailableSizes.find(
      (size) => size.id === sizeId
    );

    setTypeId(newTypeId);
    if (!isCurrentSizeAvailable && newAvailableSizes.length > 0) {
      setSizeId(newAvailableSizes[0].id);
    }
  };

  const selectedPizzaItemId = productItems.find(
    (item) => item.size?.id === sizeId && item.type?.id === typeId
  )?.id;

  const totalPrice = totalPizzaPrice(
    productItems,
    selectedPizzaItemId,
    product.ingredients,
    selectedIngredients
  );

  return {
    typeId,
    setTypeId: handleTypeChange,
    sizeId,
    setSizeId,
    selectedIngredients,
    addIngredient,
    selectedPizzaItemId,
    totalPrice,
    availableSizes,
  };
};
