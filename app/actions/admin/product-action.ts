'use server';

import {
  createProductSchema,
  ProductFormValues,
  ProductItemFormValues,
} from '@/lib';
import { prisma } from '@/server';
import { ActionResult, Product } from '@/types';
import { revalidatePath } from 'next/cache';
import { deleteImageFile } from '../delete-image-file';

export async function createProduct(
  data: ProductFormValues,
): Promise<ActionResult<Product>> {
  try {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return {
        success: false,
        message: 'Категория не найдена',
      };
    }

    const isPizza = category.isPizza;
    const validationResult = createProductSchema(isPizza).safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        message: 'VALIDATION_ERROR',
      };
    }

    const { name, imageUrl, categoryId, ingredientIds, productItems } =
      validationResult.data;

    const product = await prisma.product.create({
      data: {
        name,
        imageUrl,
        categoryId,
        ingredients: {
          connect: ingredientIds.map((id: string) => ({ id })),
        },
        productItems: {
          create: productItems || [],
        },
      },
      include: {
        category: true,
        ingredients: true,
        productItems: true,
      },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_POST]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult<null>> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        success: false,
        message: 'Продукт не найден',
      };
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_DELETE]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function updateProduct(
  id: string,
  data: ProductFormValues,
): Promise<ActionResult<Product>> {
  try {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return {
        success: false,
        message: 'Категория не найдена',
      };
    }

    const isPizza = category.isPizza;
    const validationResult = createProductSchema(isPizza).safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        message: 'VALIDATION_ERROR',
      };
    }

    const { name, imageUrl, categoryId, ingredientIds, productItems } =
      validationResult.data;

    // Get existing product to check if image changed
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        imageUrl: true,
        productItems: {
          include: {
            orderItems: true, // Check if productItems are in orders
          },
        },
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: 'Продукт не найден',
      };
    }

    // Simplified productItems update logic: soft delete all existing items and create new ones
    // Or we could intelligently upsert, but given the user's request, soft delete is safer.
    // However, to keep it simple and clean as per previous logic, we'll mark old items as inactive.

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        imageUrl,
        categoryId,
        ingredients: {
          set: ingredientIds.map((id: string) => ({ id })),
        },
        productItems: {
          updateMany: {
            where: { productId: id },
            data: { isActive: false },
          },
          create: productItems.map((item: ProductItemFormValues) => ({
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

    revalidatePath('/admin/products');

    return {
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_PUT]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}
