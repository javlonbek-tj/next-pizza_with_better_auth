import Decimal from 'decimal.js';

// Generic type that works with both Prisma and DTO
type CartItemCalculation = {
  quantity: number;
  productItem: {
    price: number;
  };
  ingredients: {
    price: number;
  }[];
};

export const calCartItemTotalPrice = (
  cartItem: CartItemCalculation
): number => {
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
