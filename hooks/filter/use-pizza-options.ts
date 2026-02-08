'use client';

import { useState } from 'react';
import { useSet } from 'react-use';
import { useSearchParams } from 'next/navigation';

import { totalPizzaPrice } from '@/lib/product';
import { PizzaSize, ProductWithRelations } from '@/types';

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
  const searchParams = useSearchParams();
  const productItems = product.productItems;

  // Get filter params from URL
  const filterSizeId = searchParams.get('pizzaSize')?.split(',')[0]; // First selected size
  const filterTypeId = searchParams.get('pizzaTypes')?.split(',')[0]; // First selected type

  // Find the item that matches filters
  const getDefaultItem = () => {
    // Try to find item matching both filters
    if (filterSizeId && filterTypeId) {
      const matchingItem = productItems.find(
        (item) => item.size?.id === filterSizeId && item.type?.id === filterTypeId
      );
      if (matchingItem) return matchingItem;
    }

    // Try to find item matching size filter only
    if (filterSizeId) {
      const matchingItem = productItems.find(
        (item) => item.size?.id === filterSizeId
      );
      if (matchingItem) return matchingItem;
    }

    // Try to find item matching type filter only
    if (filterTypeId) {
      const matchingItem = productItems.find(
        (item) => item.type?.id === filterTypeId
      );
      if (matchingItem) return matchingItem;
    }

    // Fallback to cheapest item
    return productItems.reduce((cheapest, current) =>
      current.price < cheapest.price ? current : cheapest
    );
  };

  const defaultItem = getDefaultItem();
  const defaultTypeId = defaultItem?.type?.id as string;
  const defaultSizeId = defaultItem?.size?.id as string;

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
