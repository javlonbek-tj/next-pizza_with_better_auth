import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/prisma/prisma-client';
import { categorySchema } from '@/components/admin';

export async function GET(req: NextRequest) {
  try {
    /*  const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('[ADMIN_CATEGORIES_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = categorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data' },
        { status: 400 }
      );
    }

    const { name, slug } = validationResult.data;

    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: { equals: slug, mode: 'insensitive' } },
        ],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: `Категория "${name}" уже существует` },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('[ADMIN_CATEGORIES_POST]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
