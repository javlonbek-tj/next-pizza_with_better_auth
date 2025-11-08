// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/prisma/prisma-client';

export async function GET(req: NextRequest) {
  try {
    /*  const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const products = await prisma.product.findMany({
      include: {
        category: true,
        ingredients: true,
        productItems: {
          select: {
            id: true,
            price: true,
            size: true,
            type: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    /* const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const data = await req.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        categoryId: data.categoryId,
        ingredients: {
          connect: data.ingredientIds?.map((id: string) => ({ id })) || [],
        },
        productItems: {
          create: data.productItems || [],
        },
      },
      include: {
        category: true,
        ingredients: true,
        productItems: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
