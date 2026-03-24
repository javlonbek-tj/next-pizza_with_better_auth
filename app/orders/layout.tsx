import React from 'react';
import { Metadata } from 'next';

import { SimpleHeader } from '@/components/header/server';
import { requireSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Orders',
};

export default async function OrdersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireSession();
  return (
    <div className='bg-[#F4F1EE] min-h-screen'>
      <SimpleHeader />
      {children}
    </div>
  );
}
