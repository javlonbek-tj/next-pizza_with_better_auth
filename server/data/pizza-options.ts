import { prisma } from '../prisma';

export const getPizzaTypes = async () => {
  return await prisma.pizzaType.findMany({
    include: {
      _count: {
        select: {
          productItems: true,
        },
      },
    },
  });
};

export const getPizzaSizes = async () => {
  return await prisma.pizzaSize.findMany({
    include: {
      _count: {
        select: {
          productItems: true,
        },
      },
    },
  });
};
