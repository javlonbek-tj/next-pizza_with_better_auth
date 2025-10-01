'use server';

import bcrypt from 'bcryptjs';
import {
  registerSchema,
  RegisterValues,
} from '@/components/modals/auth-modal/forms/schemas';
import prisma from '@/prisma/prisma-client';
import { createVerificationCode } from '@/lib/verify-email/create-verification-code';

export async function registerAction(values: RegisterValues) {
  const parsed = registerSchema.safeParse(values);

  if (!parsed.success) {
    return { error: 'Invalid input data' };
  }

  const { name, email, password } = parsed.data;

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Пользователь уже существует',
      };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save to database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await createVerificationCode(user.id, email);

    return {
      success: false, // user is not logged in yet
      needsVerification: true,
      userId: user.id,
      email: user.email,
    };
  } catch (err) {
    // TODO REMOVE IN PRODUCTION
    console.error(err);
    return { success: false, error: 'Произошла ошибка. Попробуйте ещё раз' };
  }
}
