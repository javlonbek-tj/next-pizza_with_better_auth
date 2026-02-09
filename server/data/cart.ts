
import { prisma } from '@/server/prisma';

export const findOrCreateCart = async (token: string) => {
  let userCart = await prisma.cart.findFirst({
    where: {
      token,
    },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: {
        token,
      },
    });
  }

  return userCart;
};

export const getUserCart = async (cartToken: string) => {
  const userCart = await prisma.cart.findFirst({
    where: {
      token: cartToken,
    },
    include: {
      user: true,
      items: {
        include: {
          ingredients: true,
          productItem: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  return userCart;
};