import { auth } from '@/auth';
import { Header } from './Header';

export async function HomeHeader() {
  const session = await auth();
  return <Header key="home-header" session={session} hasSearch hasCartBtn />;
}
