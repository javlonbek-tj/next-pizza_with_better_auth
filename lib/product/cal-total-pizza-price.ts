import { Ingredient, ProductItem } from '@/lib/generated/prisma/client';
import Decimal from 'decimal.js';

export const totalPizzaPrice = (
  items: ProductItem[],
  ingredients: Ingredient[],
  typeId: string,
  sizeId: string,
  selectedIngredients: Set<string>
) => {
  const pizzaPrice = new Decimal(
    items.find((item) => item.typeId === typeId && item.sizeId === sizeId)
      ?.price || 0
  );

  const totalIngredientsPrice = ingredients
    .filter((ing) => selectedIngredients.has(ing.id))
    .reduce((acc, ing) => acc.plus(ing.price), new Decimal(0));

  return pizzaPrice.plus(totalIngredientsPrice).toNumber();
};
