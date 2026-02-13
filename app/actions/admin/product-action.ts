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

    await prisma.product.delete({
      where: { id },
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

    // Check if any productItems are in orders
    const hasOrderReferences = existingProduct.productItems.some(
      (item) => item.orderItems.length > 0,
    );

    if (hasOrderReferences && !isPizza) {
      return {
        success: false,
        message:
          'Невозможно изменить продукт: он содержит варианты, которые используются в заказах',
      };
    }

    // Prepare productItems data
    let productItemsData = {};

    if (isPizza) {
      // For pizza products, update productItems
      if (hasOrderReferences) {
        // If there are order references, we can't use deleteMany
        // Instead, we need to handle it more carefully
        return {
          success: false,
          message:
            'Невозможно изменить варианты продукта: они используются в заказах. Пожалуйста, создайте новый продукт.',
        };
      } else {
        // Safe to delete and recreate
        productItemsData = {
          deleteMany: {},
          create: productItems.map((item: ProductItemFormValues) => ({
            price: item.price,
            sizeId: item.sizeId,
            typeId: item.typeId,
          })),
        };
      }
    } else {
      // For non-pizza products, only delete if no order references
      if (!hasOrderReferences) {
        productItemsData = {
          deleteMany: {},
        };
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        imageUrl,
        categoryId,
        ingredients: {
          set: ingredientIds.map((id: string) => ({ id })),
        },
        ...(Object.keys(productItemsData).length > 0 && {
          productItems: productItemsData,
        }),
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
