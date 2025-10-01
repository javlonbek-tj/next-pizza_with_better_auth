import { auth } from '@/auth';
import { Header } from './Header';

export async function SimpleHeader() {
  const session = await auth();
  return (
    <Header
      key="simple-header"
      hasSearch={false}
      hasCartBtn={false}
      session={session}
    />
  );
}
