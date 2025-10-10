import { auth } from '@/lib';
import { Header } from './header';
import { headers } from 'next/headers';

export async function HomeHeader() {
  const session = await auth.api.getSession({ headers: await headers() });
  return <Header key='home-header' session={session} />;
}
