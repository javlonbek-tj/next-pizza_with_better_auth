import { Category, Product } from '@/lib/generated/prisma/client';
import { Ingredient } from '@/lib/generated/prisma/client';
import { ProductItem } from '@/lib/generated/prisma/client';

export type ProductWithRelations = Product & {
  productItems: ProductItem[];
  ingredients: Ingredient[];
};

export type CategoryWithProductCount = Category & {
  _count: { products: number };
};
