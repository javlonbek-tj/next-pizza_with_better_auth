import { prisma } from '../prisma';

export const getIngredients = async () => {
  return await prisma.ingredient.findMany();
};
