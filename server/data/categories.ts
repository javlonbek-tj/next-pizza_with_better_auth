import { cacheLife, cacheTag } from 'next/cache';
import { prisma } from '../prisma';
import type { CategoryWhereInput } from '@/lib/generated/prisma/models';
import { CategoryListItem, CategoryTableRow } from '@/types';

export const getCategoryList = async (): Promise<CategoryListItem[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('categories-nav');
  return prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      slug: true,
      name: true,
      isPizza: true,
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const getCategoriesTableData = async (
  search: string = '',
  page: number = 1,
  limit: number = 10,
): Promise<{ data: CategoryTableRow[]; total: number }> => {
  const skip = (page - 1) * limit;

  const where: CategoryWhereInput = {
    isActive: true,
    ...(search && {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.category.count({ where }),
  ]);

  return { data, total };
};
