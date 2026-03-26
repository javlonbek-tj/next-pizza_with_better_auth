'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/server/prisma';
import type { ActionResult } from '@/types';
import type { UserRoleValue } from '@/lib/constants';
import { requireAdmin, getServerSession } from '@/lib/auth';

export async function updateUserRole(
  id: string,
  role: UserRoleValue,
): Promise<ActionResult<null>> {
  const session = await getServerSession();
  if (session?.user.id === id) {
    return { success: false, error: 'SELF_ROLE_UPDATE' };
  }

  await requireAdmin();

  try {
    await prisma.user.update({
      where: { id },
      data: { role },
    });

    revalidatePath('/admin/users');
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'INTERNAL_SERVER_ERROR' };
  }
}

export async function deleteUser(id: string): Promise<ActionResult<null>> {
  const session = await getServerSession();
  if (session?.user.id === id) {
    return { success: false, error: 'SELF_DELETE' };
  }

  await requireAdmin();

  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'INTERNAL_SERVER_ERROR' };
  }
}
