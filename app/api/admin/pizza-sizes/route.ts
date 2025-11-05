import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

import { pizzaSizeSchema } from '@/components/admin';

export async function GET(req: NextRequest) {
  try {
    /* const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const pizzaSizes = await prisma.pizzaSize.findMany({
      include: {
        _count: {
          select: { ProductItem: true },
        },
      },
      orderBy: { size: 'asc' },
    });

    return NextResponse.json({ success: true, data: pizzaSizes });
  } catch (error) {
    console.error('[ADMIN_PIZZA_SIZES_GET]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Parse and validate
    const validationResult = pizzaSizeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      );
    }

    const { label, size } = validationResult.data;

    const existingSize = await prisma.pizzaSize.findFirst({
      where: {
        size,
      },
    });

    if (existingSize) {
      return NextResponse.json(
        { success: false, message: `Размер "${size}" уже существует` },
        { status: 409 }
      );
    }

    // Create new pizza size
    const pizzaSize = await prisma.pizzaSize.create({
      data: { label, size },
    });

    return NextResponse.json({ success: true, data: pizzaSize });
  } catch (error) {
    console.error('[ADMIN_PIZZA_SIZES_POST]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
