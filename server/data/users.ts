import { Prisma } from '@/lib/generated/prisma/client';
import { prisma } from '../prisma';
import type { UserTableRow } from '@/types';

export const getUsersTableData = async (
  search: string = '',
  page: number = 1,
  limit: number = 10,
): Promise<{ data: UserTableRow[]; total: number }> => {
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        image: true,
        createdAt: true,
        accounts: { select: { providerId: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total };
};
