import { randomUUID } from 'crypto';

import { findOrCreateCart } from '@/lib/cart/find-or-crate-cart';
import prisma from '@/prisma/prisma-client';
import { AddToCartDto } from '@/services/dto/cart.dto';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ items: [], totalAmount: 0 });
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

    const updatedCart = await prisma.cart.findUnique({
      where: { id: userCart.id },
      include: {
        items: {
          include: {
            productItem: {
              include: { product: true },
            },
            ingredients: true,
          },
        },
      },
    });

    const resp = NextResponse.json(updatedCart);
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
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
