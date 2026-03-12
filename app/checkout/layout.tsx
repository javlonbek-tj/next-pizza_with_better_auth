import React from 'react';
import { Metadata } from 'next';

import { SimpleHeader } from '@/components/header/server';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-[#F4F1EE] min-h-screen">
      <SimpleHeader />
      {children}
    </div>
  );
}
