'use server';

import { prisma } from '@/server/prisma';
import { requireAdmin } from '@/lib/auth';
import type { ActionResult } from '@/types';
import type { Order } from '@/lib/generated/prisma/client';
import { OrderStatus } from '@/lib/generated/prisma/enums';

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<ActionResult<Order>> {
  try {
    await requireAdmin();

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return { success: true, data: order };
  } catch {
    return { success: false, message: 'Ошибка при обновлении статуса заказа' };
  }
}
