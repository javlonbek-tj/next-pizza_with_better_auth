

import { calCartItemTotalPrice } from './cal-cart-item-total-price';
import { Ingredient } from '@/types';
import { CartDto } from '@/types/cart';

export const getCartDetails = (data: CartDto) =>
  data.items.map((item) => ({
    id: item.id,
    name: item.productItem.product.name,
    pizzaType: item.productItem.type?.type,
    pizzaSize: item.productItem.size?.size,
    quantity: item.quantity,
    imageUrl: item.productItem.product.imageUrl,
    totalCartItemPrice: calCartItemTotalPrice(item),
    ingredients: item.ingredients.map((ingredient: Ingredient) => ({
      name: ingredient.name,
      price: ingredient.price,
    })),
  }));
