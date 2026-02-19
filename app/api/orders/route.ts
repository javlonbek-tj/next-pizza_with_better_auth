import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { cookies } from 'next/headers';
import { getUserCart } from '@/server/data/cart';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      return NextResponse.json(
        { message: 'Cart token not found' },
        { status: 400 },
      );
    }

    const userCart = await getUserCart(cartToken);

    if (!userCart || userCart.items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        token: cartToken,
        totalAmount: data.totalAmount,
        deliveryPrice: data.deliveryPrice,
        status: 'PENDING',
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        userId: userCart.userId,
        items: {
          create: userCart.items.map(
            (item: {
              productItemId: string;
              productItem: { price: number };
              quantity: number;
              ingredients: { id: string; name: string; price: number }[];
            }) => ({
              productItemId: item.productItemId,
              quantity: item.quantity,
              price: item.productItem.price,
              ingredients: item.ingredients.map(
                (ing: { id: string; name: string; price: number }) => ({
                  id: ing.id,
                  name: ing.name,
                  price: ing.price,
                }),
              ),
            }),
          ),
        },
      },
    });

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('[ORDERS_POST] Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
