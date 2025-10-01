// app/actions/resend-code.ts
'use server';

import { createVerificationCode } from '@/lib/verify-email/create-verification-code';
import prisma from '@/prisma/prisma-client';

export async function resendCodeAction(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, error: 'Пользователь не найден' };
  }

  if (user.emailVerified) {
    return { success: false, error: 'Пользователь уже подтвержден' };
  }

  await createVerificationCode(user.id, user.email as string);

  return { success: true, message: 'Новый код отправлен на вашу почту' };
}
