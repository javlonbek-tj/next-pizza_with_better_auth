import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../prisma';
import type { IngredientWhereInput } from '@/lib/generated/prisma/models';
import type { Ingredient } from '@/types';

export const getIngredientList = async (): Promise<Ingredient[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('ingredients-table');
  const items = await prisma.ingredient.findMany({
    where: { isActive: true },
    select: { id: true, name: true, price: true, imageUrl: true },
    orderBy: { name: 'asc' },
  });
  return items.map((i) => ({ ...i, price: Number(i.price) }));
};

export const getIngredients = async (
  search: string = '',
  page: number = 1,
  limit: number = 10,
): Promise<{ data: Ingredient[]; total: number }> => {
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

  const [raw, total] = await Promise.all([
    prisma.ingredient.findMany({
      where,
      select: { id: true, name: true, price: true, imageUrl: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.ingredient.count({ where }),
  ]);

  const data = raw.map((i) => ({ ...i, price: Number(i.price) }));
  return { data, total };
};
