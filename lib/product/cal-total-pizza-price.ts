import { PizzaSize, PizzaType } from '@/constants/pizza';
import { Ingredient, ProductItem } from '@/generated/prisma/client';
import Decimal from 'decimal.js';

export const totalPizzaPrice = (
  items: ProductItem[],
  ingredients: Ingredient[],
  type: PizzaType,
  size: PizzaSize,
  selectedIngredients: Set<string>
) => {
  const pizzaPrice = new Decimal(
    items.find((item) => item.pizzaType === type && item.size === size)
      ?.price || 0
  );

  const totalIngredientsPrice = ingredients
    .filter((ing) => selectedIngredients.has(ing.id))
    .reduce((acc, ing) => acc.plus(ing.price), new Decimal(0));

  return pizzaPrice.plus(totalIngredientsPrice).toNumber();
};
