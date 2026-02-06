import {prisma} from '@/server/prisma';
import { NextRequest, NextResponse } from 'next/server';

import { ingredientSchema } from '@/components/admin';

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: ingredients });
  } catch (error) {
    console.error('[ADMIN_INGREDIENTS_GET]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = ingredientSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 },
      );
    }

    const { name, price, imageUrl } = validationResult.data;

    const existingIngredient = await prisma.ingredient.findUnique({
      where: { name },
    });

    if (existingIngredient) {
      return NextResponse.json(
        {
          success: false,
          message: `Ингредиент "${name}" уже существует`,
        },
        { status: 409 },
      );
    }

    const ingredient = await prisma.ingredient.create({
      data: { name, price, imageUrl },
    });

    return NextResponse.json({ success: true, data: ingredient });
  } catch (error) {
    console.error('[ADMIN_INGREDIENTS_POST]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
