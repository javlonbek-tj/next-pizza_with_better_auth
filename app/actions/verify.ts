// app/actions/verify.ts
'use server';

import prisma from '@/prisma/prisma-client';

export async function verifyCodeAction(userId: string, code: string) {
  const verification = await prisma.verificationCode.findUnique({
    where: { userId_code: { userId, code } },
  });

  if (!verification) {
    return { success: false, error: 'Неверный код' };
  }

  if (verification.expiresAt < new Date()) {
    return { success: false, error: 'Код истек' };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationCode.delete({
    where: { id: verification.id },
  });

  return { success: true, message: 'Почта успешно подтверждена!' };
}
