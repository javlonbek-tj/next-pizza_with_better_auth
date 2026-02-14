import { prisma } from '../prisma';

export const getPizzaTypes = async () => {
  return await prisma.pizzaType.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          productItems: {
            where: { isActive: true },
          },
        },
      },
    },
  });
};

export const getPizzaSizes = async () => {
  return await prisma.pizzaSize.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          productItems: {
            where: { isActive: true },
          },
        },
      },
    },
  });
};
