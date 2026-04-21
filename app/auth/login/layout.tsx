import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Логин',
};

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='bg-[#F4F1EE] min-h-screen'>
      <Header
        hasSearch={false}
        hasCartBtn={false}
        className='sticky top-0 z-50 bg-white'
      />
      <div className='flex justify-center py-6'>
        <Button asChild variant='outline' className='px-6'>
          <Link href='/'>
            <ArrowLeft size={16} /> Назад на главную
          </Link>
        </Button>
      </div>
      {children}
    </main>
  );
}
