import React from 'react';
import { Metadata } from 'next';

import { HomeHeader } from '@/components/header/server';

export const metadata: Metadata = {
  title: 'Главная',
};

export default function HomeLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <div className="flex flex-col flex-1">
      <HomeHeader />
      <main className="flex-1">{children}</main>
      {modal}
    </div>
  );
}
