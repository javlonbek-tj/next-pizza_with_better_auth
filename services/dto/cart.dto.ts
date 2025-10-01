import {
  Cart,
  CartItem,
  Ingredient,
  Product,
  ProductItem,
} from '@/generated/prisma/client';

export type CartItemDto = CartItem & {
  productItem: ProductItem & { product: Product };
  ingredients: Ingredient[];
};

export interface CartDto extends Cart {
  items: CartItemDto[];
}

export interface AddToCartDto {
  productItemId: string;
  ingredients?: string[];
  quantity?: number;
}
