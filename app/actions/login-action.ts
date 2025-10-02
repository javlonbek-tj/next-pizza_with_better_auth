'use server';
import { loginSchema, LoginValues } from '@/components/auth/schemas';
import { auth } from '@/lib';
import { APIError } from 'better-auth';

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
      // Check if the error is about email verification
      if (
        error.message.toLowerCase().includes('email') &&
        error.message.toLowerCase().includes('verif')
      ) {
        return {
          error: error.message,
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
