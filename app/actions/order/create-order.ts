'use server';

import { prisma } from '@/server/prisma';
import { CheckoutValues } from '@/components/checkout';
import { headers } from 'next/headers';
import { DELIVERY_PRICE } from '@/lib';
import { getUserCartByUserId } from '@/server/data/cart';
import { auth } from '@/lib/auth';
import type { ActionResult } from '@/types';
import type { Order } from '@/lib/generated/prisma/client';

export async function createOrder(
  data: CheckoutValues,
): Promise<ActionResult<Order>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return {
        success: false,
        message: 'Вы не авторизованы',
      };
    }

    const userCart = await getUserCartByUserId(session.user.id);

    if (!userCart || userCart.items.length === 0) {
      return {
        success: false,
        message: 'Корзина пуста',
      };
    }

    const deliveryPrice = data.deliveryPrice ?? DELIVERY_PRICE;

    const order = await prisma.order.create({
      data: {
        token: userCart.token,
        totalAmount: data.totalAmount ?? 0,
        deliveryPrice,
        status: 'PENDING',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        userId: session.user.id,
        items: {
          create: userCart.items.map((item) => ({
            productItemId: item.productItemId,
            quantity: item.quantity,
            price: Number(item.productItem.price),
            ingredients: item.ingredients.map((ing) => ({
              id: ing.id,
              name: ing.name,
              price: Number(ing.price),
            })),
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: userCart.id },
    });

    return {
      success: true,
      data: order,
    };
  } catch {
    return {
      success: false,
      message: 'Ошибка при создании заказа',
    };
  }
}
