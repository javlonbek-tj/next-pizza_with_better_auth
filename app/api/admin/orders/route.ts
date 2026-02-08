import { NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ADMIN_ORDERS_GET]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
