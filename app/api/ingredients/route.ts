import prisma from '@/prisma/prisma-client';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany();
    return NextResponse.json(ingredients);
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error('[Error fetching ingredients]:', error);
    return NextResponse.json(
      { success: false, error: 'Error while fetching ingredients' },
      { status: 500 }
    );
  }
}
