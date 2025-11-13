import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findFirst({
    where: { id: params.id },
    include: {
      ingredients: true,
      productItems: { include: { size: true, type: true } },
    },
  });

  if (!product) {
    return NextResponse.json(
      { success: false, message: 'Product not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: product,
  });
}
