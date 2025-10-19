'use server';

import { APIError } from 'better-auth';
import { headers } from 'next/headers';

import { auth } from '@/lib';
import { registerSchema, RegisterValues } from '@/components/auth/schemas';

export async function registerAction(values: RegisterValues) {
  const validationResult = registerSchema.safeParse(values);
  if (!validationResult.success) {
    return { error: 'Invalid input data', requiresVerification: false };
  }

  const { name, email, password } = validationResult.data;

  try {
    await auth.api.signUpEmail({
      headers: await headers(),
      body: { name, email, password },
    });

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
