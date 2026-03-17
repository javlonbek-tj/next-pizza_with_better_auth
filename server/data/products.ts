import { prisma } from '../prisma';
import {
  DEFAULT_PRICE_FROM,
  DEFAULT_PRICE_TO,
  SortValue,
} from '@/lib/constants';
import type { ProductWhereInput } from '@/lib/generated/prisma/models';
import { sortProductsInCategories } from '@/lib/product';
import type {
  CategoryWithRelations,
  ProductTableRow,
  ProductWithCategory,
} from '@/types';

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

export const getFilteredProducts = async (
  params: GetSearchParams,
): Promise<CategoryWithRelations[]> => {
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

  return sortProductsInCategories(categories, params.sort);
};

export const getProductById = async (
  id: string,
): Promise<ProductWithCategory | null> => {
  const product = await prisma.product.findUnique({
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

  return product;
};

export const getProductTableData = async (
  search: string = '',
  categoryId: string = 'all',
  page: number = 1,
  limit: number = 10,
): Promise<{ data: ProductTableRow[]; total: number }> => {
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
