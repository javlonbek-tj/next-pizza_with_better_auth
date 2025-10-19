// app/admin/orders/page.tsx
import { OrdersTable } from '@/components/admin/orders/OrdersTable';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-3xl">Заказы</h1>
      <OrdersTable />
    </div>
  );
}
