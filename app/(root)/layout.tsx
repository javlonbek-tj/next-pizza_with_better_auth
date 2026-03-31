import React from 'react';
import { Metadata } from 'next';

import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Главная',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <div className='flex flex-col flex-1'>
      <Header />
      {children}
      {modal}
    </div>
  );
}
