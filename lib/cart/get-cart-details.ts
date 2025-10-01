import { CartDto } from '@/services/dto/cart.dto';
import { calCartItemTotalPrice } from './cal-cart-item-total-price';
import { CartItemModel } from '@/components/cart/Cart-item-type';

export const getCartDetails = (data: CartDto): CartItemModel[] =>
  data.items.map((item) => ({
    id: item.id,
    name: item.productItem.product.name,
    pizzaType: item.productItem.pizzaType,
    pizzaSize: item.productItem.size,
    quantity: item.quantity,
    imageUrl: item.productItem.product.imageUrl,
    totalCartItemPrice: calCartItemTotalPrice(item),
    ingredients: item.ingredients.map((ingredient) => ({
      name: ingredient.name,
      price: ingredient.price,
    })),
  }));
