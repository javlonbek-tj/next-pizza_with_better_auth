import type {
  Cart,
  CartItem,
  Ingredient,
  Product,
} from '@/lib/generated/prisma/client';
import type { PizzaSize, PizzaType, ProductItemWithRelations } from './categories';

export type CartItemWithRelations = CartItem & {
  productItem: ProductItemWithRelations & { product: Product };
  ingredients: Ingredient[];
};

export type CartWithRelations = Cart & {
  items: CartItemWithRelations[];
};

export type CartItemDetails = {
  id: string;
  quantity: number;
  name: string;
  imageUrl: string;
  totalCartItemPrice: number;
  pizzaSize: PizzaSize | null;
  pizzaType: PizzaType | null;
  disabled: boolean;
  ingredients: {
    id: string;
    name: string;
    price: number;
  }[];
  productItemId: string;
};

export type AddToCartDto = {
  productItemId: string;
  ingredients?: string[];
  quantity?: number;
};
