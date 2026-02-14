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

export const getFilteredProducts = async (params: GetSearchParams) => {
  const sizes = params.pizzaSize?.split(',').filter(Boolean);
  const pizzaTypes = params.pizzaTypes?.split(',').filter(Boolean);
  const ingredients = params.ingredients?.split(',').filter(Boolean);
  const priceFrom = Number(params.priceFrom) || DEFAULT_PRICE_FROM;
  const priceTo = Number(params.priceTo) || DEFAULT_PRICE_TO;

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      products: {
        where: {
          isActive: true,
          ...(ingredients &&
            ingredients.length > 0 && {
              ingredients: {
                some: { id: { in: ingredients }, isActive: true },
              },
            }),
          productItems: {
            some: {
              isActive: true,
              price: { gte: priceFrom, lte: priceTo },
              ...(sizes && sizes.length > 0 && { sizeId: { in: sizes } }),
              ...(pizzaTypes &&
                pizzaTypes.length > 0 && { typeId: { in: pizzaTypes } }),
            },
          },
        },
        include: {
          ingredients: {
            where: { isActive: true },
          },
          productItems: {
            where: {
              isActive: true,
              price: { gte: priceFrom, lte: priceTo },
              ...(sizes && sizes.length > 0 && { sizeId: { in: sizes } }),
              ...(pizzaTypes &&
                pizzaTypes.length > 0 && { typeId: { in: pizzaTypes } }),
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

  return sortedCategories.sort((a, b) => {
    if (a.isPizza && !b.isPizza) return -1;
    if (!a.isPizza && b.isPizza) return 1;
    return 0;
  });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id, isActive: true },
    include: {
      ingredients: {
        where: { isActive: true },
      },
      category: true,
      productItems: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
        include: {
          size: true,
          type: true,
        },
      },
    },
  });
};

export const getAllProducts = async () => {
  return await prisma.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      ingredients: {
        where: { isActive: true },
      },
      productItems: {
        where: { isActive: true },
        include: {
          size: true,
          type: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};
