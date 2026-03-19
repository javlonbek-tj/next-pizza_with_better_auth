import { SimpleHeader } from '@/components/header/server';

export const metadata = { title: 'Профиль' };

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='bg-[#F4F1EE] min-h-screen'>
      <SimpleHeader />
      {children}
    </div>
  );
}
