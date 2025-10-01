import { CartItemDto } from '@/services/dto/cart.dto';
import Decimal from 'decimal.js';

export const calCartItemTotalPrice = (cartItem: CartItemDto) => {
  const pizzaPrice = new Decimal(cartItem.productItem.price);
  const totalIngredientsPrice = cartItem.ingredients.reduce(
    (acc, ing) => acc.plus(ing.price),
    new Decimal(0)
  );

  return pizzaPrice
    .plus(totalIngredientsPrice)
    .times(cartItem.quantity)
    .toNumber();
};
