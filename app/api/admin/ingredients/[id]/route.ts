import { ingredientSchema } from '@/components/admin';
import prisma from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const validationResult = ingredientSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      );
    }

    const { name, price, imageUrl } = validationResult.data;

    const existingIngredient = await prisma.ingredient.findFirst({
      where: {
        name,
        NOT: { id },
      },
    });

    if (existingIngredient) {
      return NextResponse.json(
        {
          success: false,
          message: `Ингредиент "${name}" уже существует`,
        },
        { status: 409 }
      );
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: { name, price, imageUrl },
    });

    return NextResponse.json({ success: true, data: ingredient });
  } catch (error) {
    console.error('[ADMIN_INGREDIENT_PUT]', error);
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
    const { id } = await params;

    await prisma.ingredient.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[ADMIN_INGREDIENT_DELETE]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
