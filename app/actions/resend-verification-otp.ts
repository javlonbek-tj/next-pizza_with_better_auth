'use server';
import { auth } from '@/lib';
import { APIError } from 'better-auth';

export async function resendVerificationOTP(email: string) {
  try {
    await auth.api.sendVerificationEmail({
      body: { email },
    });
    return { error: null, success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message, success: false };
    }
    return { error: 'Failed to send verification code', success: false };
  }
}
