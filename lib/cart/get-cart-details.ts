

import { calCartItemTotalPrice } from './cal-cart-item-total-price';
import { Ingredient } from '@/types';
import { CartDto } from '@/types/cart';

export const getCartDetails = (data: CartDto) =>
  data.items.map((item) => ({
    id: item.id,
    name: item.productItems.product.name,
    pizzaType: item.productItems.type,
    pizzaSize: item.productItems.size,
    quantity: item.quantity,
    imageUrl: item.productItems.product.imageUrl,
    totalCartItemPrice: calCartItemTotalPrice(item),
    ingredients: item.ingredients.map((ingredient: Ingredient) => ({
      name: ingredient.name,
      price: ingredient.price,
    })),
  }));
