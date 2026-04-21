import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { cookies } from 'next/headers';
import { getUserCart } from '@/server/data/cart';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            productItem: {
              include: { product: true, size: true, type: true },
            },
          },
        },
      },
    });

    return Response.json({ success: true, data: orders });
  } catch {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

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

    // Clear cart
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
