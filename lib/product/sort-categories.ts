import type { SortValue } from '@/lib/constants';
import type { CategoryWithRelations } from '@/types';

export function sortProductsInCategories(
  categories: CategoryWithRelations[],
  sort: SortValue | undefined,
): CategoryWithRelations[] {
  const sorted = categories.map((category) => ({
    ...category,
    products: [...category.products].sort((a, b) => {
      const priceA = Number(a.productItems[0]?.price || 0);
      const priceB = Number(b.productItems[0]?.price || 0);

      switch (sort) {
        case 'price_asc':
          return priceA - priceB;
        case 'price_desc':
          return priceB - priceA;
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    }),
  }));

  return sorted.sort((a, b) => {
    if (a.isPizza && !b.isPizza) return -1;
    if (!a.isPizza && b.isPizza) return 1;
    return 0;
  });
}
