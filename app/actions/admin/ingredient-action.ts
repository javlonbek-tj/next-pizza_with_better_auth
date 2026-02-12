'use server';

import { prisma } from '@/server';
import { revalidatePath } from 'next/cache';
import { ActionResult, Ingredient } from '@/types';
import { deleteImageFile } from '../delete-image-file';
import { IngredientFormValues, ingredientSchema } from '@/lib';

export async function createIngredient(
  data: IngredientFormValues,
): Promise<ActionResult<Ingredient>> {
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

    return {
      success: true,
      data: ingredient,
    };
  } catch (error) {
    console.error('[ADMIN_INGREDIENTS_POST]', error);
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

    return {
      success: true,
      data: ingredient,
    };
  } catch (error) {
    console.error('[ADMIN_INGREDIENTS_PUT]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function deleteIngredient(
  id: string,
): Promise<ActionResult<null>> {
  try {
    const ingredient = await prisma.ingredient.delete({
      where: { id },
    });

    await deleteImageFile(ingredient.imageUrl);

    revalidatePath('/admin/ingredients');

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('[ADMIN_INGREDIENTS_DELETE]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}
