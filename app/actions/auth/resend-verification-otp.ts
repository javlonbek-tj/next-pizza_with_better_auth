'use server';

import { auth } from '@/server';
import { APIError } from 'better-auth';

export async function resendVerificationOTP(email: string) {
  try {
    await auth.api.sendVerificationOTP({
      body: { email, type: 'email-verification' },
    });

    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: 'Failed to send verification code' };
  }
}
