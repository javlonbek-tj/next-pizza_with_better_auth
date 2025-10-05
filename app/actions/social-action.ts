'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib';

export async function signInSocialAction(provider: 'google' | 'github') {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: '/',
    },
  });

  if (url) {
    redirect(url);
  }
}
