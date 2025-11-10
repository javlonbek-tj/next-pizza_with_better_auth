import {
  Category,
  PizzaSize,
  PizzaType,
  Product,
} from '@/lib/generated/prisma/client';
import { Ingredient } from '@/lib/generated/prisma/client';
import { ProductItem } from '@/lib/generated/prisma/client';

export type ProductItems = ProductItem & {
  size: PizzaSize | null;
  type: PizzaType | null;
};

export type ProductWithRelations = Product & {
  productItems: ProductItem[];
  ingredients: Ingredient[];
  category?: Category | null;
};

export type CategoryWithProductCount = Category & {
  _count: { products: number };
};

export type PizzaSizeWithProductCount = PizzaSize & {
  _count: { ProductItem: number };
};

export type PizzaTypeWithProductCount = PizzaType & {
  _count: { ProductItem: number };
};
