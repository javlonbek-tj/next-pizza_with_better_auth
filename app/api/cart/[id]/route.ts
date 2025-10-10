import prisma from '@/prisma/prisma-client';

import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Cart not found.' },
        {
          status: 404,
        }
      );
    }

    const { quantity } = (await req.json()) as {
      quantity: number;
    };

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid quantity' },
        {
          status: 400,
        }
      );
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
        {
          success: false,
          message: 'Product not found',
        },
        {
          status: 404,
        }
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

    return NextResponse.json({
      success: true,
      message: 'Quantity updated successfully',
    });
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
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
      return NextResponse.json(
        { success: false, message: 'Cart not found.' },
        { status: 404 }
      );
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
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Product removed from cart' },
      { status: 200 }
    );
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
