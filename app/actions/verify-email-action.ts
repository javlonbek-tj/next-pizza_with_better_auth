'use server';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { auth } from '@/lib';

export async function verifyEmailAction(email: string, otp: string) {
  try {
    await auth.api.verifyEmailOTP({
      headers: await headers(),
      body: { email, otp },
    });
    return { error: null, success: true };
  } catch (err) {
    if (err instanceof APIError) {
      return { error: err.message, success: false };
    }
    return { error: 'Invalid or expired code', success: false };
  }
}
