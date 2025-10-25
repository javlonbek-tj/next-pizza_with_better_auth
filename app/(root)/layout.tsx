import React from 'react';
import { Metadata } from 'next';

import { HomeHeader } from '@/components/header';

export const metadata: Metadata = {
  title: 'Главная',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <main className='min-h-screen'>
      <HomeHeader />
      {children}
      {modal}
    </main>
  );
}
