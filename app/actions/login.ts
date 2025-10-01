'use server';

import prisma from '@/prisma/prisma-client';
import bcrypt from 'bcryptjs';
import { createVerificationCode } from '@/lib/verify-email/create-verification-code';
import { loginSchema } from '@/components/modals/auth-modal/forms/schemas';

export async function loginAction(values: unknown) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: 'Invalid input' };
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return { success: false, error: 'Неверный email или пароль' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, error: 'Неверный email или пароль' };
  }

  if (!user.emailVerified) {
    if (user.email) {
      await createVerificationCode(user.id, user.email);
    }
    return {
      success: false,
      needsVerification: true,
      userId: user.id,
      message: 'Email не подтвержден',
    };
  }

  return { success: true };
}
