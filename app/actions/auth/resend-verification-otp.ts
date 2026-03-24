'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';

export async function resendVerificationOTP(email: string) {
  try {
    await auth.api.sendVerificationOTP({
      body: { email, type: 'email-verification' },
    });
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to send verification code' };
  }
}
