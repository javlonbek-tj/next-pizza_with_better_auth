import { Ingredient } from '@/lib/generated/prisma/browser';
import Decimal from 'decimal.js';

export const totalProductPrice = (
  price: number,
  ingredients: Ingredient[],
  selectedIngredients: Set<string>
) => {
  const totalIngredientsPrice = ingredients
    .filter((ing) => selectedIngredients.has(ing.id))
    .reduce((acc, ing) => acc.plus(ing.price), new Decimal(0));

  const basePrice = new Decimal(price);
  return basePrice.plus(totalIngredientsPrice).toNumber();
};
