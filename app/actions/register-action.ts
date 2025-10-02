'use server';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { auth } from '@/lib';
import { registerSchema, RegisterValues } from '@/components/auth/schemas';

export async function registerAction(values: RegisterValues) {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { error: 'Invalid input data', requiresVerification: false };
  }

  const { name, email, password } = parsed.data;

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: { name, email, password },
    });

    // After successful signup, user needs to verify email
    return { error: null, requiresVerification: true, email };
  } catch (err) {
    if (err instanceof APIError) {
      return {
        error: err.message,
        requiresVerification: false,
      };
    }
    return { error: 'Internal server error', requiresVerification: false };
  }
}
