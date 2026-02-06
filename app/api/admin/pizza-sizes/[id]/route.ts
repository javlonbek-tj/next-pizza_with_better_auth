import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/server/prisma';

import { pizzaSizeSchema } from '@/components/admin';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    /* const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const { id } = params;
    const body = await req.json();

    const validationResult = pizzaSizeSchema.safeParse({
      ...body,
      value: Number(body.value),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 },
      );
    }

    const { size, label } = validationResult.data;

    // Check for duplicates (excluding current ID)
    const existingSize = await prisma.pizzaSize.findFirst({
      where: {
        size,
        NOT: { id },
      },
    });

    if (existingSize) {
      return NextResponse.json(
        {
          success: false,
          message: `Размер "${size}" уже существует`,
        },
        { status: 409 },
      );
    }

    // Update
    const updatedSize = await prisma.pizzaSize.update({
      where: { id },
      data: { size, label },
    });

    return NextResponse.json({ success: true, data: updatedSize });
  } catch (error) {
    console.error('[ADMIN_PIZZA_SIZE_PUT]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    /* const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const { id } = params;

    // Optional: check if pizzaSize is used in any ProductItem, if relevant in your schema
    // const usageCount = await prisma.productItem.count({
    //   where: { pizzaSizeId: id },
    // });
    // if (usageCount > 0) {
    //   return NextResponse.json(
    //     { success: false, message: 'Нельзя удалить размер, который используется в товарах' },
    //     { status: 400 }
    //   );
    // }

    await prisma.pizzaSize.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[ADMIN_PIZZA_SIZE_DELETE]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
