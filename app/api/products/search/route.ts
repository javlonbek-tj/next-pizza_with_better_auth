import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('query') || '';
    const products = await prisma.product.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      take: 5,
    });
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('[Error fetching ingredients]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
