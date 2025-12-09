import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { findOrCreateCart } from '@/lib/cart';
import { AddToCartDto } from '@/services/dto/cart.dto';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({
        success: true,
        message: 'Token not found. New user',
        data: { items: [] },
      });
    }

    const cart = await prisma.cart.findFirst({
      where: { token },
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

    if (!cart) {
      return NextResponse.json({
        success: false,
        message: 'Cart not found, returning empty cart',
        data: { items: [] },
      });
    }

    return NextResponse.json({
      success: true,
      data: cart,
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

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get('cartToken')?.value;

    if (!token) {
      token = randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as AddToCartDto;

    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
        ...(data.ingredients && data.ingredients.length > 0
          ? {
              ingredients: {
                every: { id: { in: data.ingredients } },
                none: { id: { notIn: data.ingredients } },
              },
            }
          : {
              ingredients: { none: {} },
            }),
      },
      include: {
        ingredients: true,
      },
    });

    const exactMatch =
      findCartItem &&
      findCartItem.ingredients.length === (data.ingredients?.length || 0);

    // If the cart item already exists, update its quantity
    if (exactMatch) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + (data.quantity ?? 1),
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: data.productItemId,
          quantity: data.quantity ?? 1,
          ingredients: { connect: data.ingredients?.map((id) => ({ id })) },
        },
      });
    }

    const resp = NextResponse.json({
      success: true,
      message: 'Product added to cart',
    });
    resp.cookies.set('cartToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return resp;
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Cart not found.' },
        { status: 404 }
      );
    }

    const userCart = await prisma.cart.findFirst({
      where: { token },
    });

    if (!userCart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found.' },
        { status: 404 }
      );
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cart deleted.',
    });
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error('Error deleting cart:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
