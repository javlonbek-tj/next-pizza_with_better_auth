import prisma from '@/prisma/prisma-client';

export async function verifyCode(code: string, userId?: string) {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      code,
      ...(userId && { userId }),
    },
    include: {
      user: true,
    },
  });

  if (!verificationCode) {
    throw new Error('Неверный код');
  }

  if (new Date() > verificationCode.expiresAt) {
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id },
    });
    throw new Error('Код истек');
  }

  await prisma.user.update({
    where: {
      id: verificationCode.userId,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationCode.delete({
    where: {
      id: verificationCode.id,
    },
  });

  return verificationCode.user;
}
