'use server';

import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

import { loginSchema, LoginValues } from '@/components/auth/schemas';
import { resendVerificationOTP } from './resend-verification-otp';

export async function loginAction(values: LoginValues) {
  const validationResult = loginSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      success: false,
      error: 'Invalid input data',
      requiresVerification: false,
    };
  }

  const { email, password } = validationResult.data;

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: { email, password },
    });
    return { success: true, error: null, requiresVerification: false };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.message.toLowerCase() === 'invalid email or password') {
        return {
          success: false,
          message: 'Неверный логин или пароль',
          requiresVerification: false,
        };
      }
      if (
        error.message.toLowerCase().includes('email') &&
        error.message.toLowerCase().includes('verif')
      ) {
        const resendResult = await resendVerificationOTP(email);

        if (!resendResult.success) {
          return {
            success: false,
            message: 'Не удалось отправить код подтверждения',
            requiresVerification: false,
          };
        }

        return {
          success: false,
          message: 'Пожалуйста, подтвердите вашу почту',
          requiresVerification: true,
          email,
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
      error: 'Internal server error',
      requiresVerification: false,
    };
  }
}
