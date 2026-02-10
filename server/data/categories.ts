import { prisma } from "../prisma";

export const getCategories = async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    }
  });
};  