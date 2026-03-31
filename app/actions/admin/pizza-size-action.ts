'use server';

import { PizzaSizeFormValues, pizzaSizeSchema } from '@/lib';
import { prisma } from '@/server';
import { ActionResult, PizzaSize } from '@/types';
import { revalidatePath, updateTag } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function createPizzaSize(
  data: PizzaSizeFormValues,
): Promise<ActionResult<PizzaSize>> {
  await requireAdmin();

  const validationResult = pizzaSizeSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { label, size } = validationResult.data;

  try {
    const existingSize = await prisma.pizzaSize.findFirst({
      where: {
        OR: [{ size }, { label: { contains: label, mode: 'insensitive' } }],
      },
    });

    if (existingSize) {
      return {
        success: false,
        message: `Размер или название уже существует`,
      };
    }

    const pizzaSize = await prisma.pizzaSize.create({
      data: { label, size },
    });

    revalidatePath('/admin/pizza-sizes');
    updateTag('pizza-sizes-table');

    return {
      success: true,
      data: pizzaSize,
    };
  } catch {
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function updatePizzaSize(
  id: string,
  data: PizzaSizeFormValues,
): Promise<ActionResult<PizzaSize>> {
  await requireAdmin();

  const validationResult = pizzaSizeSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: 'VALIDATION_ERROR',
    };
  }

  const { label, size } = validationResult.data;

  try {
    const existingSize = await prisma.pizzaSize.findFirst({
      where: {
        OR: [{ size }, { label: { contains: label, mode: 'insensitive' } }],
        NOT: { id },
      },
    });

    if (existingSize) {
      return {
        success: false,
        message: `Размер или название уже существует`,
      };
    }

    const pizzaSize = await prisma.pizzaSize.update({
      where: { id },
      data: { label, size },
    });

    revalidatePath('/admin/pizza-sizes');
    updateTag('pizza-sizes-table');

    return {
      success: true,
      data: pizzaSize,
    };
  } catch {
    return {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
  }
}

export async function deletePizzaSize(id: string): Promise<ActionResult<null>> {
  await requireAdmin();

  try {
    await prisma.pizzaSize.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath('/admin/pizza-sizes');
    updateTag('pizza-sizes-table');

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
