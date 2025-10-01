import { Product } from '@/lib/generated/prisma/client';
import { Ingredient } from '@/lib/generated/prisma/client';
import { ProductItem } from '@/lib/generated/prisma/client';

export type ProductWithRelations = Product & {
  productItems: ProductItem[];
  ingredients: Ingredient[];
};
