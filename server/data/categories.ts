import { prisma } from '../prisma';

export const getCategories = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          products: {
            where: { isActive: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};
