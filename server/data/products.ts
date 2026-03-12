import {
  DEFAULT_PRICE_FROM,
  DEFAULT_PRICE_TO,
  SortValue,
} from '@/lib/constants';
import { prisma } from '../prisma';
import type { ProductWhereInput } from '@/lib/generated/prisma/models';

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

export const getProductTableData = async (
  search: string = '',
  categoryId: string = 'all',
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const where: ProductWhereInput = {
    isActive: true,
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    }),
    ...(categoryId && categoryId !== 'all' && { categoryId }),
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            productItems: true,
            ingredients: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { data, total };
};
