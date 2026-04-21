'use server';

import { prisma } from '@/server';
import { revalidatePath, updateTag } from 'next/cache';
import { ActionResult, Ingredient } from '@/types';
import { deleteImageFile } from '../delete-image-file';
import { IngredientFormValues, ingredientSchema } from '@/lib';
import { requireAdmin } from '@/lib/auth';

export async function createIngredient(
  data: IngredientFormValues,
): Promise<ActionResult<Ingredient>> {
  await requireAdmin();

  const validationResult = ingredientSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { name, price, imageUrl } = validationResult.data;

  try {
    const existingIngredient = await prisma.ingredient.findUnique({
      where: { name },
    });

    if (existingIngredient) {
      return {
        success: false,
        message: `Ингредиент "${name}" уже существует`,
      };
    }

    const ingredient = await prisma.ingredient.create({
      data: { name, price, imageUrl },
    });

    revalidatePath('/admin/ingredients');
    revalidatePath('/admin/products');
    updateTag('ingredients-table');

    return {
      success: true,
      data: { ...ingredient, price: Number(ingredient.price) },
    };
  } catch {
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function updateIngredient(
  id: string,
  data: IngredientFormValues,
): Promise<ActionResult<Ingredient>> {
  await requireAdmin();

  const validationResult = ingredientSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { name, price, imageUrl } = validationResult.data;

  try {
    const existingIngredient = await prisma.ingredient.findFirst({
      where: {
        OR: [{ name }, { name: { contains: name, mode: 'insensitive' } }],
        NOT: { id },
      },
    });

    if (existingIngredient) {
      return {
        success: false,
        message: `Ингредиент "${name}" уже существует`,
      };
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: { name, price, imageUrl },
    });

    revalidatePath('/admin/ingredients');
    revalidatePath('/admin/products');
    updateTag('ingredients-table');

    return {
      success: true,
      data: { ...ingredient, price: Number(ingredient.price) },
    };
  } catch {
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function deleteIngredient(
  id: string,
): Promise<ActionResult<null>> {
  await requireAdmin();

  try {
    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: { isActive: false },
    });

    await deleteImageFile(ingredient.imageUrl);

    revalidatePath('/admin/ingredients');
    revalidatePath('/admin/products');
    updateTag('ingredients-table');

    return {
      success: true,
      data: null,
    };
  } catch {
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}
