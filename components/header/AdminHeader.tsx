import { auth } from '@/server';
import { headers } from 'next/headers';
import { AdminPageHeader } from '../admin';

export async function AdminHeader() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <AdminPageHeader session={session} />;
}
