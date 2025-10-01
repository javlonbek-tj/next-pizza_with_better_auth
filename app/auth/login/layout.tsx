import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SimpleHeader } from '@/components/header/Simple-header';

export const metadata: Metadata = {
  title: 'Логин',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <main className='bg-[#F4F1EE] min-h-screen'>
      <SimpleHeader />
      <div className='flex justify-center py-6'>
        <Button asChild variant='outline' className='px-6'>
          <Link href='/'>
            <ArrowLeft size={16} /> Назад на главную
          </Link>
        </Button>
      </div>
      {children}
      {modal}
    </main>
  );
}
