import type { Cart } from '@/lib/generated/prisma/client';
import { prisma } from '@/server/prisma';
import type { CartWithRelations } from '@/types';

export const findOrCreateCart = async (token: string): Promise<Cart> => {
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

export const getUserCart = async (
  cartToken: string,
): Promise<CartWithRelations | null> => {
  const userCart = await prisma.cart.findFirst({
    where: {
      token: cartToken,
    },
    include: {
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          ingredients: true,
          productItem: {
            include: {
              product: true,
              size: true,
              type: true,
            },
          },
        },
      },
    },
  });

  return userCart;
};
