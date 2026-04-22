import { Suspense } from 'react';
import { Orders } from '@/components/admin';

export default function OrdersPage() {
  return (
    <Suspense>
      <Orders />
    </Suspense>
  );
}
