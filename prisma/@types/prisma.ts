import { Product } from '@/generated/prisma/client';
import { Ingredient } from '@/generated/prisma/client';
import { ProductItem } from '@/generated/prisma/client';

export type ProductWithRelations = Product & {
  productItems: ProductItem[];
  ingredients: Ingredient[];
};
