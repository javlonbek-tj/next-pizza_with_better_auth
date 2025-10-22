import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';
import { pizzaTypeSchema } from '@/components/admin';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /* const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const { id } = params;
    const body = await req.json();

    const validationResult = pizzaTypeSchema.safeParse({ body });

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      );
    }

    const { type } = validationResult.data;

    // Check for duplicates (excluding current ID)
    const existingType = await prisma.pizzaType.findFirst({
      where: {
        type,
        NOT: { id },
      },
    });

    if (existingType) {
      return NextResponse.json(
        {
          success: false,
          message: `Тип "${type}" уже существует`,
        },
        { status: 409 }
      );
    }

    // Update
    const updatedSize = await prisma.pizzaType.update({
      where: { id },
      data: { type },
    });

    return NextResponse.json({ success: true, data: updatedSize });
  } catch (error) {
    console.error('[ADMIN_PIZZA_TYPE_PUT]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ DELETE — remove pizza size
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    await prisma.pizzaType.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[ADMIN_PIZZA_TYPE_DELETE]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
