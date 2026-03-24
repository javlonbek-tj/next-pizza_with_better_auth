'use server';

import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function signoutAction() {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to sign out' };
  }
}
