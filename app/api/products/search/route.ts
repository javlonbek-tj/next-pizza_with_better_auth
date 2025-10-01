import prisma from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('query') || '';
    const products = await prisma.product.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      take: 5,
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('[Error fetching ingredients]:', error);
    return NextResponse.json(
      { success: false, error: 'Error while fetching ingredients' },
      { status: 500 }
    );
  }
}
