'use server';

import { auth } from '@/lib/auth';
import { APIError } from 'better-auth';

export async function verifyEmailAction(email: string, otp: string) {
  try {
    await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });
    return { success: true, error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { success: false, error: err.message };
    }
    return { success: false, error: 'Invalid or expired code' };
  }
}
