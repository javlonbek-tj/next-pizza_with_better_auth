'use server';

import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { auth } from '@/lib';

export async function signoutAction() {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      return { error: error.message };
    }
    return { error: 'Failed to sign out' };
  }
}
