'use server';

import { ActionResult, Category } from '@/types';
import { categorySchema, CategoryFormValues } from '@/lib';
import { prisma } from '@/server';
import { revalidatePath } from 'next/cache';

export async function createCategory(
  data: CategoryFormValues,
): Promise<ActionResult<Category>> {
  const validationResult = categorySchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { name, slug, isPizza } = validationResult.data;

  try {
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: { equals: slug, mode: 'insensitive' } },
        ],
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: `Категория "${name}" уже существует`,
      };
    }

    const category = await prisma.category.create({
      data: { name, slug, isPizza },
    });

    revalidatePath('/admin/categories');

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error('[ADMIN_CATEGORIES_POST]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function updateCategory(
  id: string,
  data: CategoryFormValues,
): Promise<ActionResult<Category>> {
  const validationResult = categorySchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { name, slug, isPizza } = validationResult.data;

  try {
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
      return {
        success: false,
        message: `Категория "${name}" уже существует`,
      };
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, isPizza },
    });

    revalidatePath('/admin/categories');

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error('[ADMIN_CATEGORIES_PUT]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult<null>> {
  try {
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath('/admin/categories');

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('[ADMIN_CATEGORIES_DELETE]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}
