import { Suspense } from 'react';
import { Orders } from '@/components/admin';
import { AdminTableSkeleton } from '@/components/skeletons';

export default function OrdersPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton cols={6} />}>
      <Orders />
    </Suspense>
  );
}
