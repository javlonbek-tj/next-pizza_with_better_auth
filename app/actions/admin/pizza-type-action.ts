'use server';

import { PizzaTypeFormValues, pizzaTypeSchema } from '@/lib';
import { prisma } from '@/server';
import { ActionResult, PizzaType } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createPizzaType(
  data: PizzaTypeFormValues,
): Promise<ActionResult<PizzaType>> {
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

    return {
      success: true,
      data: pizzaType,
    };
  } catch (error) {
    console.error('[ADMIN_PIZZA_TYPES_POST]', error);
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

    return {
      success: true,
      data: pizzaType,
    };
  } catch (error) {
    console.error('[ADMIN_PIZZA_TYPES_PUT]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function deletePizzaType(id: string): Promise<ActionResult<null>> {
  try {
    await prisma.pizzaType.delete({
      where: { id },
    });

    revalidatePath('/admin/pizza-types');

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('[ADMIN_PIZZA_TYPES_DELETE]', error);
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}
