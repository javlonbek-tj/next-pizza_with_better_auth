import Decimal from 'decimal.js';


type CartItemCalculation = {
  quantity: number;
  productItems: {
    price: number;
  };
  ingredients: {
    price: number;
  }[];
};

export const calCartItemTotalPrice = (
  cartItem: CartItemCalculation
): number => {
  const pizzaPrice = new Decimal(cartItem.productItems.price);

  const totalIngredientsPrice = cartItem.ingredients.reduce<Decimal>(
    (acc, ing) => acc.plus(new Decimal(ing.price)),
    new Decimal(0)
  );

  return pizzaPrice
    .plus(totalIngredientsPrice)
    .times(cartItem.quantity)
    .toNumber();
};
