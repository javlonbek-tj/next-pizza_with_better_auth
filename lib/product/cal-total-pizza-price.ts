import { Ingredient, ProductItem } from '@/lib/generated/prisma/browser';
import Decimal from 'decimal.js';

export const totalPizzaPrice = (
  items: ProductItem[],
  selectedPizzaItemId: string | undefined,
  ingredients: Ingredient[],
  selectedIngredients: Set<string>
) => {
  const pizzaPrice = new Decimal(
    items.find((item) => item.id === selectedPizzaItemId)?.price || 0
  );

  const totalIngredientsPrice = ingredients
    .filter((ing) => selectedIngredients.has(ing.id))
    .reduce((acc, ing) => acc.plus(ing.price), new Decimal(0));

  return pizzaPrice.plus(totalIngredientsPrice).toNumber();
};
