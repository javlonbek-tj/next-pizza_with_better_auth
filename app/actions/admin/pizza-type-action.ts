'use server';

import { PizzaTypeFormValues, pizzaTypeSchema } from '@/lib';
import { prisma } from '@/server';
import { ActionResult, PizzaType } from '@/types';
import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function createPizzaType(
  data: PizzaTypeFormValues,
): Promise<ActionResult<PizzaType>> {
  await requireAdmin();

  const validationResult = pizzaTypeSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { type } = validationResult.data;

  try {
    const existingType = await prisma.pizzaType.findFirst({
      where: {
        type: { contains: type, mode: 'insensitive' },
      },
    });

    if (existingType) {
      return {
        success: false,
        message: `Тип пиццы уже существует`,
      };
    }

    const pizzaType = await prisma.pizzaType.create({
      data: { type },
    });

    revalidatePath('/admin/pizza-types');
    updateTag('pizza-types-table');

    return {
      success: true,
      data: pizzaType,
    };
  } catch {
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function updatePizzaType(
  id: string,
  data: PizzaTypeFormValues,
): Promise<ActionResult<PizzaType>> {
  await requireAdmin();

  const validationResult = pizzaTypeSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { type } = validationResult.data;

  try {
    const existingType = await prisma.pizzaType.findFirst({
      where: {
        type: { contains: type, mode: 'insensitive' },
        NOT: { id },
      },
    });

    if (existingType) {
      return {
        success: false,
        message: `Тип пиццы уже существует`,
      };
    }

    const pizzaType = await prisma.pizzaType.update({
      where: { id },
      data: { type },
    });

    revalidatePath('/admin/pizza-types');
    updateTag('pizza-types-table');

    return {
      success: true,
      data: pizzaType,
    };
  } catch {
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function deletePizzaType(id: string): Promise<ActionResult<null>> {
  await requireAdmin();

  try {
    await prisma.pizzaType.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath('/admin/pizza-types');
    updateTag('pizza-types-table');

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
