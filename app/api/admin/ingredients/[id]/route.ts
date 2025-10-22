import { ingredientSchema } from '@/components/admin';
import prisma from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFile } from '@/app/actions';

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

    const currentIngredient = await prisma.ingredient.findUnique({
      where: { id },
    });

    if (!currentIngredient) {
      return NextResponse.json(
        { success: false, message: 'Ингредиент не найден' },
        { status: 404 }
      );
    }

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

    // Delete old image if it changed
    if (currentIngredient.imageUrl !== imageUrl) {
      await deleteImageFile(currentIngredient.imageUrl);
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

    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient) {
      return NextResponse.json(
        { success: false, message: 'Ингредиент не найден' },
        { status: 404 }
      );
    }

    await prisma.ingredient.delete({
      where: { id },
    });

    // Delete image file
    await deleteImageFile(ingredient.imageUrl);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[ADMIN_INGREDIENT_DELETE]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
