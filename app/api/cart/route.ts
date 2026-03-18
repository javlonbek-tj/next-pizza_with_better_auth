import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/server/prisma';
import {
  findOrCreateCart,
  getUserCart,
  getUserCartByUserId,
} from '@/server/data/cart';
import { auth } from '@/server';
import { AddToCartDto } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('cartToken')?.value;
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    // Auth user: userId cart (merge hook has already been done inside better-auth)
    if (userId) {
      const cart = await getUserCartByUserId(userId);
      if (cart) {
        return Response.json({ success: true, data: cart });
      }
    }

    // Guest: search by token, but only unassigned cart
    if (token) {
      const cart = await getUserCart(token);
      if (cart && !cart.userId) {
        return Response.json({ success: true, data: cart });
      }
    }

    return Response.json({ success: true, data: { items: [] } });
  } catch {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;
    const cookieToken = req.cookies.get('cartToken')?.value;

    let token: string;

    if (userId) {
      // Auth user: use userId cart
      const existingCart = await prisma.cart.findFirst({ where: { userId } });
      token = existingCart?.token ?? cookieToken ?? randomUUID();
    } else if (cookieToken) {
      // Guest + cookie: token should not belong to another user
      const existingCart = await prisma.cart.findFirst({
        where: { token: cookieToken },
      });
      token = existingCart?.userId ? randomUUID() : cookieToken;
    } else {
      // New guest
      token = randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    // If the user is authenticated and the cart is not yet linked to a userId → link it
    if (userId && !userCart.userId) {
      await prisma.cart.update({
        where: { id: userCart.id },
        data: { userId },
      });
    }

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
  } catch {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Cart not found.' },
        { status: 404 },
      );
    }

    const userCart = await prisma.cart.findFirst({
      where: { token },
    });

    if (!userCart) {
      return NextResponse.json(
        { success: false, message: 'Cart not found.' },
        { status: 404 },
      );
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Cart deleted',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
