import prisma from '@/prisma/prisma-client';

import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Cart not found.' }, { status: 404 });
    }

    const { quantity } = (await req.json()) as {
      quantity: number;
    };

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const param = await params;

    const cartItemId = await param.id;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { token },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: quantity,
      },
    });

    const cart = await prisma.cart.findFirst({
      where: {
        token,
      },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(cart);
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Cart not found.' }, { status: 404 });
    }

    const param = await params;

    const cartItemId = await param.id;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { token },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json(
      { message: 'Cart item deleted successfully', id: cartItemId },
      { status: 200 }
    );
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
