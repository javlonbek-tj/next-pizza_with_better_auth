import { CartItemDto } from '@/services/dto/cart.dto';
import Decimal from 'decimal.js';

export const calCartItemTotalPrice = (cartItem: CartItemDto): number => {
  const pizzaPrice = new Decimal(cartItem.productItem.price);

  const totalIngredientsPrice = cartItem.ingredients.reduce<Decimal>(
    (acc, ing) => acc.plus(new Decimal(ing.price)),
    new Decimal(0)
  );

  return pizzaPrice
    .plus(totalIngredientsPrice)
    .times(cartItem.quantity)
    .toNumber();
};
