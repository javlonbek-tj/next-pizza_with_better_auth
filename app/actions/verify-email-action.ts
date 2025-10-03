'use server';
import { APIError } from 'better-auth';
import { auth } from '@/lib';

export async function verifyEmailAction(email: string, otp: string) {
  try {
    await auth.api.verifyEmailOTP({
      body: {
        email,
        otp,
      },
    });
    return { error: null };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message };
    }
    return { error: 'Invalid or expired code' };
  }
}
