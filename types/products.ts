import type { Category } from './categories';
import type { Ingredient } from './ingredients';
import type { PizzaSize, PizzaType } from './pizza';

export type Product = {
  id: string;
  name: string;
  imageUrl: string;
  category: {
    name: string;
  };
  _count: {
    productItems: number;
    ingredients: number;
  };
};

export type ProductItem = {
  id: string;
  price: number;
  sizeId: string | null;
  typeId: string | null;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
};

export type ProductItems = ProductItem & {
  size: PizzaSize | null;
  type: PizzaType | null;
};

export type ProductWithRelations = Product & {
  productItems: ProductItems[];
  ingredients: Ingredient[];
  category?: Category | null;
};
