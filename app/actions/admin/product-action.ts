'use server';

import { createProductSchema, ProductFormValues } from '@/lib';
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

    await prisma.$transaction([
      prisma.product.update({
        where: { id },
        data: { isActive: false },
      }),
      prisma.productItem.updateMany({
        where: { productId: id },
        data: { isActive: false },
      }),
    ]);
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
        categoryId: true,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: 'Продукт не найден',
      };
    }

    if (existingProduct.categoryId !== categoryId) {
      return {
        success: false,
        message: 'Категорию нельзя изменить при редактировании',
      };
    }

    const itemsWithId = productItems.filter((item) => item.id);
    const itemsWithoutId = productItems.filter((item) => !item.id);
    const itemIdsToKeep = itemsWithId.map((item) => item.id as string);

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Deactivate items not in the list
      await tx.productItem.updateMany({
        where: {
          productId: id,
          id: { notIn: itemIdsToKeep },
          isActive: true,
        },
        data: { isActive: false },
      });

      // 2. Update existing items
      for (const item of itemsWithId) {
        await tx.productItem.update({
          where: { id: item.id },
          data: {
            price: item.price,
            sizeId: item.sizeId,
            typeId: item.typeId,
            isActive: true,
          },
        });
      }

      // 3. Create new items
      if (itemsWithoutId.length > 0) {
        await tx.productItem.createMany({
          data: itemsWithoutId.map((item) => ({
            productId: id,
            price: item.price,
            sizeId: item.sizeId,
            typeId: item.typeId,
          })),
        });
      }

      // 4. Update product main fields and return with relations
      return await tx.product.update({
        where: { id },
        data: {
          name,
          imageUrl,
          ingredients: {
            set: ingredientIds.map((id: string) => ({ id })),
          },
        },
        include: {
          category: true,
          ingredients: true,
          productItems: {
            where: { isActive: true },
            include: {
              size: true,
              type: true,
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
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
