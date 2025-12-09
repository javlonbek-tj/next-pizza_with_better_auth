import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { pizzaTypeSchema } from '@/components/admin';

export async function GET(req: NextRequest) {
  try {
    /* const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const pizzaTypes = await prisma.pizzaType.findMany({
      include: {
        _count: {
          select: { productItems: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: pizzaTypes });
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
    const validationResult = pizzaTypeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      );
    }

    const { type } = validationResult.data;

    const existingType = await prisma.pizzaType.findFirst({
      where: {
        type: { equals: type, mode: 'insensitive' },
      },
    });

    if (existingType) {
      return NextResponse.json(
        { success: false, message: `Тип "${type}" уже существует` },
        { status: 409 }
      );
    }

    // Create new pizza size
    const pizzaType = await prisma.pizzaType.create({
      data: { type },
    });

    return NextResponse.json({ success: true, data: pizzaType });
  } catch (error) {
    console.error('[ADMIN_PIZZA_SIZES_POST]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
