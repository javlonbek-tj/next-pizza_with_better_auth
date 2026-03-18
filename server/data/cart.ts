import type { Cart } from '@/lib/generated/prisma/client';
import { prisma } from '@/server/prisma';
import type { CartWithRelations } from '@/types';

const cartInclude = {
  items: {
    orderBy: { createdAt: 'desc' as const },
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

export const findOrCreateCart = async (token: string): Promise<Cart> => {
  let userCart = await prisma.cart.findFirst({
    where: { token },
  });

  if (!userCart) {
    userCart = await prisma.cart.create({
      data: { token },
    });
  }

  return userCart;
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

export const mergeCartsOnLogin = async (
  guestToken: string,
  userId: string,
): Promise<void> => {
  const guestCart = await prisma.cart.findFirst({
    where: { token: guestToken },
    include: { items: { include: { ingredients: true } } },
  });

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { ingredients: true } } },
  });

  // Guest cart yo'q → hech narsa qilish shart emas
  if (!guestCart) return;

  // Bir xil cart (logout qilinmay token saqlanib qolgan holat) → hech narsa qilish shart emas
  if (userCart && guestCart.id === userCart.id) return;

  // User cart yo'q → guest cart'ga userId biriktirish
  if (!userCart) {
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId },
    });
    return;
  }

  // Ikkala cart ham bor → guest itemlarni user cart'ga merge qilish
  for (const guestItem of guestCart.items) {
    const matchingItem = userCart.items.find(
      (ui) =>
        ui.productItemId === guestItem.productItemId &&
        ui.ingredients.length === guestItem.ingredients.length &&
        guestItem.ingredients.every((gi) =>
          ui.ingredients.some((uii) => uii.id === gi.id),
        ),
    );

    if (matchingItem) {
      await prisma.cartItem.update({
        where: { id: matchingItem.id },
        data: { quantity: matchingItem.quantity + guestItem.quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: guestItem.productItemId,
          quantity: guestItem.quantity,
          ingredients: {
            connect: guestItem.ingredients.map((i) => ({ id: i.id })),
          },
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
};
