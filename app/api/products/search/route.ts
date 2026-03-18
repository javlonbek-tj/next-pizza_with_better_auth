import { NextRequest } from 'next/server';
import { prisma } from '@/server/prisma';

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get('query') || '';
    const products = await prisma.product.findMany({
      where: { name: { contains: query, mode: 'insensitive' } },
      take: 5,
    });
    return Response.json({
      success: true,
      data: products,
    });
  } catch {
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
