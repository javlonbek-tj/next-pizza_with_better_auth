import { SimpleHeader } from '@/components/header/server';
import { requireSession } from '@/lib/auth';

export const metadata = { title: 'Профиль' };

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  return (
    <div className='bg-[#F4F1EE] min-h-screen'>
      <SimpleHeader />
      {children}
    </div>
  );
}
