import React from 'react';
import { Metadata } from 'next';

import { SimpleHeader } from '@/components/header/simple-header';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className='bg-[#F4F1EE] min-h-screen'>
      <SimpleHeader />
      {children}
    </main>
  );
}
