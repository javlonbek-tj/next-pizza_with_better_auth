import { Ingredient } from './ingredients';
import { Product, ProductItems } from './products';

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

export interface CartDto extends Cart {
  items: CartItemDto[];
}

export interface AddToCartDto {
  productItemId: string;
  ingredients?: string[];
  quantity?: number;
}
