import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../prisma';
import type { IngredientWhereInput } from '@/lib/generated/prisma/models';

export const getIngredientList = async () => {
  'use cache';
  cacheLife('hours');
  cacheTag('ingredients-table');
  return prisma.ingredient.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
    },
  });
};

export const getIngredients = async (
  search: string = '',
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const where: IngredientWhereInput = {
    isActive: true,
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.ingredient.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.ingredient.count({ where }),
  ]);

  return { data, total };
};
