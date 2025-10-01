import { VerificationUserTemplate } from '@/components/email-templates/verification-user-template';
import prisma from '@/prisma/prisma-client';

export async function createVerificationCode(userId: string, email: string) {
  // Delete any existing verification codes for this user
  await prisma.verificationCode.deleteMany({
    where: { userId },
  });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minute from now

  await prisma.verificationCode.create({
    data: {
      code,
      userId,
      expiresAt,
    },
  });

  /* await sendEmail(
    email,
    'Next Pizza / 📝 Подтверждение регистрации',
    VerificationUserTemplate({ code })
  ); */
}
