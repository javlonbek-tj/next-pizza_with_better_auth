import { CartItemModel } from '@/components/cart/CartItemType';
import {
  mapPizzaSize,
  mapPizzaType,
  PizzaSize,
  PizzaType,
} from '@/lib/constants';

export const getCartItemDetails = (
  ingredients: CartItemModel['ingredients'],
  pizzaSize?: number | null,
  pizzaType?: number | null
) => {
  const details: string[] = [];

  if (pizzaSize && pizzaType) {
    details.push(
      `${mapPizzaSize[pizzaSize as PizzaSize]} ${pizzaSize} см - ${
        mapPizzaType[pizzaType as PizzaType]
      }`
    );
  }
  if (ingredients.length) {
    details.push(...ingredients.map((ing) => ing.name));
  }

  return details.join(', ');
};
