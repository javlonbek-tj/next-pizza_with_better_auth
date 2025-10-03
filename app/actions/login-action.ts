'use server';

import { APIError } from 'better-auth';

import { loginSchema, LoginValues } from '@/components/auth/schemas';
import { auth } from '@/lib';
import { resendVerificationOTP } from './resend-verification-otp';

export async function loginAction(values: LoginValues) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: 'Invalid input data', requiresVerification: false };
  }

  const { email, password } = parsed.data;

  try {
    await auth.api.signInEmail({
      body: { email, password },
    });
    return { error: null, requiresVerification: false };
  } catch (error) {
    if (error instanceof APIError) {
      if (
        error.message.toLowerCase().includes('email') &&
        error.message.toLowerCase().includes('verif')
      ) {
        const resendResult = await resendVerificationOTP(email);

        if (resendResult.error) {
          return {
            error: 'Не удалось отправить код подтверждения',
            requiresVerification: false,
          };
        }

        return {
          error: 'Пожалуйста, подтвердите вашу почту',
          requiresVerification: true,
          email,
        };
      }
      return {
        error: error.message,
        requiresVerification: false,
      };
    }
    return { error: 'Internal server error', requiresVerification: false };
  }
}
