import { prisma } from '../prisma';
import { cacheLife, cacheTag } from 'next/cache';
import type {
  PizzaSizeWhereInput,
  PizzaTypeWhereInput,
} from '@/lib/generated/prisma/models';
import type {
  PizzaSize,
  PizzaTypeTableRow,
  PizzaType,
  PizzaSizeTableRow,
} from '@/types';

export const getPizzaTypesList = async (): Promise<PizzaType[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('pizza-types-table');
  return prisma.pizzaType.findMany({
    select: {
      id: true,
      type: true,
    },
  });
};
export const getPizzaTypes = async (
  search: string = '',
  page: number = 1,
  limit: number = 10,
): Promise<{ data: PizzaTypeTableRow[]; total: number }> => {
  const skip = (page - 1) * limit;

  const where: PizzaTypeWhereInput = {
    isActive: true,
    ...(search && {
      type: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.pizzaType.findMany({
      where,
      select: {
        id: true,
        type: true,
        _count: {
          select: {
            productItems: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.pizzaType.count({ where }),
  ]);

  return { data, total };
};

export const getPizzaSizesList = async (): Promise<PizzaSize[]> => {
  'use cache';
  cacheLife('hours');
  cacheTag('pizza-sizes-table');
  return prisma.pizzaSize.findMany({
    select: {
      id: true,
      size: true,
      label: true,
    },
  });
};

export const getPizzaSizes = async (
  search: string = '',
  page: number = 1,
  limit: number = 10,
): Promise<{ data: PizzaSizeTableRow[]; total: number }> => {
  const skip = (page - 1) * limit;

  const where: PizzaSizeWhereInput = {
    isActive: true,
    ...(search && {
      label: {
        contains: search,
        mode: 'insensitive',
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.pizzaSize.findMany({
      where,
      select: {
        id: true,
        size: true,
        label: true,
        _count: {
          select: {
            productItems: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.pizzaSize.count({ where }),
  ]);

  return { data, total };
};
