

import { calCartItemTotalPrice } from './cal-cart-item-total-price';
import { Ingredient } from '@/types';
import { CartDto } from '@/types/cart';

export const getCartDetails = (data: CartDto) =>
  data.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    name: item.productItem.product.name,
    imageUrl: item.productItem.product.imageUrl,
    totalCartItemPrice: calCartItemTotalPrice(item),
    pizzaSize: item.productItem.size,
    pizzaType: item.productItem.type,
    disabled: false,
    ingredients: item.ingredients.map((ingredient: Ingredient) => ({
      name: ingredient.name,
      price: ingredient.price,
      id: ingredient.id,
    })),
    productItemId: item.productItem.id,
  }));
