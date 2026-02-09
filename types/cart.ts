import { Ingredient } from './ingredients';
import { Product, ProductItems } from './products';
import { PizzaSize, PizzaType } from './pizza';

export  type Cart = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    userId: string | null;
}

export type CartItem = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    quantity: number;
    productItemId: string;
    cartId: string;
}

export type CartItemDto = CartItem & {
  productItem: ProductItems & { product: Product };
  ingredients: Ingredient[];
};

export type CartDto = Cart & {
  items: CartItemDto[];
}

export type AddToCartDto = {
  productItemId: string;
  ingredients?: string[];
  quantity?: number;
}

export interface CartItemModel {
  id: string;
  name: string;
  pizzaType: PizzaType | null;
  pizzaSize: PizzaSize | null;
  quantity: number;
  imageUrl: string;
  totalCartItemPrice: number;
  ingredients: Array<{ name: string; price: number }>;
}
