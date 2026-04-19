import { Suspense } from 'react';
import { Container, Title } from '@/components/shared';
import { UserOrders } from '@/components/orders/UserOrders';
import { requireSession } from '@/lib/auth';

export const metadata = { title: 'Мои заказы' };

async function OrdersContent() {
  await requireSession();
  return (
    <Container className="py-10">
      <Title text="Мои заказы" size="lg" className="mb-4 font-bold" />
      <UserOrders />
    </Container>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
