'use server';

import { prisma } from '@/server/prisma';
import { CheckoutValues } from '@/components/checkout';
import { cookies } from 'next/headers';
import { DELIVERY_PRICE } from '@/lib';
import { getUserCart } from '@/server/data/cart';

export async function createOrder(data: CheckoutValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }

    const userCart = await getUserCart(cartToken);

    if (!userCart || userCart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const totalAmount =
      data.totalAmount ??
      userCart.items.reduce((acc, item) => {
        const ingredientsPrice = item.ingredients.reduce(
          (acc, ing) => acc + ing.price,
          0
        );
        return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
      }, DELIVERY_PRICE);

    const deliveryPrice = data.deliveryPrice ?? DELIVERY_PRICE;

    const order = await prisma.order.create({
      data: {
        token: cartToken,
        totalAmount,
        deliveryPrice,
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
