import { auth } from '@/server';
import { Header } from './Header';
import { headers } from 'next/headers';

export async function HomeHeader() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <Header key='home-header' session={session} />;
}
