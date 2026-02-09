import { CartItemModel } from '@/types';
import { PizzaSize, PizzaType } from '@/types';

export const getCartItemDetails = (
  ingredients: CartItemModel['ingredients'],
  pizzaSize: PizzaSize | null,
  pizzaType: PizzaType | null
) => {
  const details: string[] = [];

  if (pizzaSize && pizzaType) {
    details.push(
      `${pizzaSize.label} ${pizzaSize.size} см - ${
        pizzaType.type
      }`
    );
  }
  if (ingredients.length) {
    details.push(...ingredients.map((ing) => ing.name));
  }

  return details.join(', ');
};
