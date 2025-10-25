import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma-client';

import { categorySchema } from '@/components/admin';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /* const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const { id } = await params;
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
        NOT: { id },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: `Категория "${name}"  уже существует`,
        },
        { status: 409 }
      );
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('[ADMIN_CATEGORY_PUT]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    /*  const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const { id } = await params;

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Can not delete category with products' },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error('[ADMIN_CATEGORY_DELETE]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
