'use server';

import { prisma } from '@/server/prisma';
import { CheckoutValues } from '@/components/checkout';
import { cookies } from 'next/headers';

export async function createOrder(data: CheckoutValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }

    // 1. Get cart and items
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

    if (!userCart || userCart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // 2. Calculate total price
    const totalAmount = userCart.items.reduce((acc, item) => {
      const ingredientsPrice = item.ingredients.reduce((acc, ing) => acc + ing.price, 0);
      return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
    }, 100); // 100 is delivery price

    // 3. Create order
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        totalAmount,
        status: 'PENDING',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        userId: userCart.userId,
        items: {
          create: userCart.items.map((item) => ({
            productItemId: item.productItemId,
            quantity: item.quantity,
            price: item.productItem.price,
            ingredients: item.ingredients.map((ing) => ({
              id: ing.id,
              name: ing.name,
              price: ing.price,
            })),
          })),
        },
      },
    });

    // 4. Clear cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    return order;
  } catch (error) {
    console.error('[CREATE_ORDER] Error:', error);
    throw error;
  }
}
