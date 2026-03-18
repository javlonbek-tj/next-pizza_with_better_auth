import { prisma } from '@/server/prisma';
import { NextRequest } from 'next/server';
import { auth } from '@/server';

async function findCartItem(cartItemId: string, req: NextRequest) {
  const token = req.cookies.get('cartToken')?.value;
  const session = await auth.api.getSession({ headers: req.headers });
  const userId = session?.user?.id;

  return prisma.cartItem.findFirst({
    where: {
      id: cartItemId,
      cart: {
        OR: [
          ...(token ? [{ token }] : []),
          ...(userId ? [{ userId }] : []),
        ],
      },
    },
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { quantity } = (await req.json()) as { quantity: number };

    if (!Number.isInteger(quantity) || quantity < 1) {
      return Response.json(
        { success: false, message: 'Invalid quantity' },
        { status: 400 },
      );
    }

    const { id: cartItemId } = await params;
    const cartItem = await findCartItem(cartItemId, req);

    if (!cartItem) {
      return Response.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return Response.json({ success: true, message: 'Quantity updated successfully' });
  } catch {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: cartItemId } = await params;
    const cartItem = await findCartItem(cartItemId, req);

    if (!cartItem) {
      return Response.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    return Response.json({ success: true, message: 'Product removed from the cart' });
  } catch {
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
