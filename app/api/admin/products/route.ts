// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/prisma/prisma-client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where = search
      ? {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          productItems: {
            take: 1,
            orderBy: { price: 'asc' },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
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
          connect: data.ingredients?.map((id: string) => ({ id })),
        },
        productItems: {
          create: data.productItems,
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
