import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const ingredients = await prisma.ingredient.findMany();
    return NextResponse.json({
      success: true,
      data: ingredients,
    });
  } catch (error) {
    // TODO REMOVE CONSOLE
    console.error('[Error fetching ingredients]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
