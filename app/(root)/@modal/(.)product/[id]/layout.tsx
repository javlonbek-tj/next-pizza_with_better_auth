import { Suspense } from 'react';
import { ChooseProductModal } from '@/components/modals';

export default function ProductModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <ChooseProductModal>{children}</ChooseProductModal>
    </Suspense>
  );
}
