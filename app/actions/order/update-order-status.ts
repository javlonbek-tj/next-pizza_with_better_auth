'use server';

import { prisma } from '@/server/prisma';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import type { ActionResult } from '@/types';
import type { Order } from '@/lib/generated/prisma/client';
import { OrderStatus } from '@/lib/generated/prisma/enums';

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<ActionResult<Order>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return { success: false, message: 'Вы не авторизованы' };
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return { success: true, data: order };
  } catch {
    return { success: false, message: 'Ошибка при обновлении статуса заказа' };
  }
}
