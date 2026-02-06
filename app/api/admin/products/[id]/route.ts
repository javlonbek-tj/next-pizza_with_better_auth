
import { NextRequest, NextResponse } from 'next/server';

import {prisma} from '@/server/prisma';
import { deleteImageFile } from '@/app/actions';
import { ProductItem } from '@/lib/generated/prisma/client';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    /*  const session = await auth();
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } */

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 },
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    if (product.imageUrl) {
      await deleteImageFile(product.imageUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_PRODUCT_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const productId = params.id;
    const body = await req.json();

    const { name, imageUrl, categoryId, ingredientIds, productItems } = body;

    // Get existing product to check if image changed
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { imageUrl: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Продукт не найден' },
        { status: 404 },
      );
    }

    // Update product with all relations
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        imageUrl,
        categoryId,
        ingredients: {
          set: ingredientIds.map((id: string) => ({ id })),
        },
        productItems: {
          deleteMany: {}, // Delete all existing items
          create: productItems.map((item: ProductItem) => ({
            price: item.price,
            sizeId: item.sizeId,
            typeId: item.typeId,
          })),
        },
      },
      include: {
        category: true,
        ingredients: true,
        productItems: {
          include: {
            size: true,
            type: true,
          },
        },
      },
    });

    // Delete old image if it changed
    if (existingProduct.imageUrl !== imageUrl) {
      await deleteImageFile(existingProduct.imageUrl);
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('[PRODUCT_UPDATE_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Ошибка при обновлении продукта' },
      { status: 500 },
    );
  }
}
