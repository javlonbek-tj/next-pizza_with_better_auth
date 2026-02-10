'use server';

import { PizzaSizeFormValues, pizzaSizeSchema } from '@/lib';
import { prisma } from '@/server';
import { ActionResult } from '@/types';
import { revalidatePath } from 'next/cache';

export async function createPizzaSize(data: PizzaSizeFormValues): Promise<ActionResult<any>> {
    const validationResult = pizzaSizeSchema.safeParse(data);

    if (!validationResult.success) {
        return {
            success: false,
            error: 'VALIDATION_ERROR',
        };
    }

    const {label, size} = validationResult.data;

    try {
        const existingSize = await prisma.pizzaSize.findFirst({
            where: {
                size,
            },
        });

        if (existingSize) {
            return {
                success: false,
                message: `Размер "${size}" уже существует`,
            };
        }

        const pizzaSize = await prisma.pizzaSize.create({
            data: { label, size },
        });

        revalidatePath('/admin/pizza-sizes');

        return {
            success: true,
            data: pizzaSize,
        };
    } catch (error) {
        console.error('[ADMIN_PIZZA_SIZES_POST]', error);
        return {
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
        };
    }
}

export async function updatePizzaSize(id: string, data: PizzaSizeFormValues): Promise<ActionResult<any>> {
    const validationResult = pizzaSizeSchema.safeParse(data);

    if (!validationResult.success) {
        return {
            success: false,
            error: 'VALIDATION_ERROR',
        };
    }

    const {label, size} = validationResult.data;

    try {
        const existingSize = await prisma.pizzaSize.findFirst({
            where: {
                size,
                NOT: { id },
            },
        });

        if (existingSize) {
            return {
                success: false,
                message: `Размер "${size}" уже существует`,
            };
        }

        const pizzaSize = await prisma.pizzaSize.update({
            where: { id },
            data: { label, size },
        });

        revalidatePath('/admin/pizza-sizes');

        return {
            success: true,
            data: pizzaSize,
        };
    } catch (error) {
        console.error('[ADMIN_PIZZA_SIZES_PUT]', error);
        return {
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
        };
    }
}

export async function deletePizzaSize(id: string): Promise<ActionResult<any>> {
    try {
        await prisma.pizzaSize.delete({
            where: { id },
        });

        revalidatePath('/admin/pizza-sizes');

        return {
          success: true,
          data: null,
        };
    } catch (error) {
        console.error('[ADMIN_PIZZA_SIZES_DELETE]', error);
        return {
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
        };
    }
}
