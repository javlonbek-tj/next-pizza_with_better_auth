import { headers } from 'next/headers';
import { Header } from './Header';
import { auth } from '@/lib';

export async function SimpleHeader() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <Header
      key='simple-header'
      hasSearch={false}
      hasCartBtn={false}
      session={session}
    />
  );
}
