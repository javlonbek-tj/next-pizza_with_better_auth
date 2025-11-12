'use client';

import { useState } from 'react';
import { useSet } from 'react-use';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { totalPizzaPrice } from '@/lib/product';
import { Variant } from '@/components/product/GroupVariants';
import { PizzaSize } from '@/lib/generated/prisma';
import { useGetPizzaSizes, useGetPizzaTypes } from '../admin';

interface ReturnProps {
  typeId: string;
  setTypeId: (id: string) => void;
  sizeId: string;
  setSizeId: (id: string) => void;
  allPizzaSizes: Variant[];
  allPizzaTypes: Variant[];
  selectedIngredients: Set<string>;
  addIngredient: (id: string) => void;
  description: string;
  selectedPizzaItemId?: string;
  totalPrice: number;
  isPending: boolean;
  pizzaSize?: number;
}

export const usePizzaOptions = (product: ProductWithRelations): ReturnProps => {
  const { data: pizzaSizes = [], isPending: isPizzaSizesPending } =
    useGetPizzaSizes();
  const { data: pizzaTypes = [], isPending: isPizzaTypesPending } =
    useGetPizzaTypes();
  const isPending = isPizzaSizesPending || isPizzaTypesPending;

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

  const allPizzaSizes = pizzaSizes.map((pizzaSize): Variant => {
    return {
      name: pizzaSize.label,
      value: pizzaSize.id,
      disabled: !availableSizes.some((size) => size?.id === pizzaSize.id),
    };
  });

  const allPizzaTypes = pizzaTypes.map((pizzaType): Variant => {
    return {
      name: pizzaType.type,
      value: pizzaType.id,
      disabled: !productItems.some((item) => item.type?.id === pizzaType.id),
    };
  });

  const description = `${
    pizzaSizes.find((size) => size.id === sizeId)?.size
  } см, ${pizzaTypes.find((type) => type.id === typeId)?.type} пицца`;

  const selectedPizzaItemId = productItems.find(
    (item) => item.size?.id === sizeId && item.type?.id === typeId
  )?.id;

  const totalPrice = totalPizzaPrice(
    productItems,
    selectedPizzaItemId,
    product.ingredients,
    selectedIngredients
  );

  const pizzaSize = pizzaSizes.find((size) => size.id === sizeId)?.size;

  return {
    typeId,
    setTypeId: handleTypeChange,
    sizeId,
    setSizeId,
    allPizzaSizes,
    allPizzaTypes,
    selectedIngredients,
    addIngredient,
    description,
    selectedPizzaItemId,
    totalPrice,
    isPending,
    pizzaSize,
  };
};
