import { calCartItemTotalPrice } from './cal-cart-item-total-price';
import {
  CartItemDetails,
  CartItemWithRelations,
  CartWithRelations,
} from '@/types';

export const getCartDetails = (data: CartWithRelations): CartItemDetails[] =>
  data.items.map((item: CartItemWithRelations) => ({
    id: item.id,
    quantity: item.quantity,
    name: item.productItem.product.name,
    imageUrl: item.productItem.product.imageUrl,
    totalCartItemPrice: calCartItemTotalPrice({
      quantity: item.quantity,
      productItem: { price: Number(item.productItem.price) },
      ingredients: item.ingredients.map((i) => ({ price: Number(i.price) })),
    }),
    pizzaSize: item.productItem.size,
    pizzaType: item.productItem.type,
    disabled: false,
    ingredients: item.ingredients.map((ingredient) => ({
      name: ingredient.name,
      price: Number(ingredient.price),
      id: ingredient.id,
    })),
    productItemId: item.productItem.id,
  }));
