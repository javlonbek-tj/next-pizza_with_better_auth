'use server';

import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

import { registerSchema, RegisterValues } from '@/components/auth/schemas';

export async function registerAction(values: RegisterValues) {
  const validationResult = registerSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      success: false,
      error: 'Invalid input data',
      requiresVerification: false,
    };
  }

  const { name, email, password } = validationResult.data;

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: { name, email, password },
    });

    return { success: true, error: null, requiresVerification: true, email };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.message.toLowerCase().startsWith('user already exists')) {
        return {
          success: false,
          message: 'Пользователь с таким email уже существует',
          requiresVerification: false,
        };
      }
      if (
        error.message.toLocaleLowerCase().startsWith('password is too short')
      ) {
        return {
          success: false,
          message: 'Пароль должен содержать не менее 6 символов',
          requiresVerification: false,
        };
      }
      return {
        success: false,
        error: error.message,
        requiresVerification: false,
      };
    }
    return {
      success: false,
      error: 'Внутренняя ошибка сервера',
      requiresVerification: false,
    };
  }
}
