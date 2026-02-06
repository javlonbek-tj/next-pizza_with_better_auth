'use server';
import {
  DEFAULT_PRICE_FROM,
  DEFAULT_PRICE_TO,
  SortValue,
} from '@/lib/constants';
import { prisma } from '../prisma';


export interface GetSearchParams {
  query?: string;
  sortBy?: string;
  pizzaSize?: string;
  pizzaTypes?: string;
  ingredients?: string;
  priceFrom?: string;
  priceTo?: string;
  sort?: SortValue;
}

export const findPizzas = async (params: GetSearchParams) => {
  const sizes = params.pizzaSize?.split(',').filter(Boolean);
  const pizzaTypes = params.pizzaTypes?.split(',').filter(Boolean);
  const ingredients = params.ingredients?.split(',').filter(Boolean);
  const priceFrom = Number(params.priceFrom) || DEFAULT_PRICE_FROM;
  const priceTo = Number(params.priceTo) || DEFAULT_PRICE_TO;

  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: {
          ...(ingredients &&
            ingredients.length > 0 && {
              ingredients: {
                some: { id: { in: ingredients } },
              },
            }),
          productItems: {
            some: {
              price: { gte: priceFrom, lte: priceTo },
              ...(sizes && sizes.length > 0 && { sizeId: { in: sizes } }), // Changed: size → sizeId
              ...(pizzaTypes &&
                pizzaTypes.length > 0 && { typeId: { in: pizzaTypes } }), // Changed: pizzaType → typeId
            },
          },
        },
        include: {
          ingredients: true,
          productItems: {
            where: {
              price: { gte: priceFrom, lte: priceTo },
              ...(sizes && sizes.length > 0 && { sizeId: { in: sizes } }), // Changed: size → sizeId
              ...(pizzaTypes &&
                pizzaTypes.length > 0 && { typeId: { in: pizzaTypes } }), // Changed: pizzaType → typeId
            },
            orderBy: { createdAt: 'asc' },
            include: {
              size: true,
              type: true,
            },
          },
        },
      },
    },
  });

  // Sort products within each category
  const sortedCategories = categories.map((category) => ({
    ...category,
    products: [...category.products].sort((a, b) => {
      const priceA = a.productItems[0]?.price || 0;
      const priceB = b.productItems[0]?.price || 0;

      switch (params.sort) {
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

  // Always put "Пиццы" first
  return sortedCategories.sort((a, b) => {
    if (a.name === 'Пиццы') return -1;
    if (b.name === 'Пиццы') return 1;
    return 0;
  });
};
