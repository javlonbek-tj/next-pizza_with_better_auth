import type { Cart } from '@/lib/generated/prisma/client';
import { prisma } from '@/server/prisma';
import type { CartWithRelations } from '@/types';

const cartInclude = {
  items: {
    orderBy: {
      createdAt: 'desc' as const,
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
};

export const findOrCreateCart = async (token: string, userId?: string): Promise<Cart> => {
  if (userId) {
    const userCart = await prisma.cart.findFirst({ where: { userId } });
    if (userCart) return userCart;
  }

  let tokenCart = await prisma.cart.findFirst({ where: { token } });

  if (!tokenCart) {
    tokenCart = await prisma.cart.create({ data: { token, userId } });
  } else if (userId && !tokenCart.userId) {
    tokenCart = await prisma.cart.update({
      where: { id: tokenCart.id },
      data: { userId },
    });
  }

  return tokenCart;
};

export const getUserCart = async (
  cartToken: string,
): Promise<CartWithRelations | null> => {
  return prisma.cart.findFirst({
    where: { token: cartToken },
    include: cartInclude,
  });
};

export const getUserCartByUserId = async (
  userId: string,
): Promise<CartWithRelations | null> => {
  return prisma.cart.findFirst({
    where: { userId },
    include: cartInclude,
  });
};

export const mergeCartsOnLogin = async (token: string, userId: string): Promise<void> => {
  const anonymousCart = await prisma.cart.findFirst({
    where: { token },
    include: { items: { include: { ingredients: true } } },
  });

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { ingredients: true } } },
  });

  if (!anonymousCart) {
    if (!userCart) {
      await prisma.cart.create({ data: { token, userId } });
    }
    return;
  }

  if (!userCart) {
    await prisma.cart.update({
      where: { id: anonymousCart.id },
      data: { userId },
    });
    return;
  }

  for (const anonItem of anonymousCart.items) {
    const existingItem = userCart.items.find(
      (item) => item.productItemId === anonItem.productItemId,
    );

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + anonItem.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: anonItem.productItemId,
          quantity: anonItem.quantity,
          ingredients: {
            connect: anonItem.ingredients.map((i) => ({ id: i.id })),
          },
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: anonymousCart.id } });
};
