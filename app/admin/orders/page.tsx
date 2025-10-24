import { OrdersTable } from '@/components';

export default function OrdersPage() {
  return (
    <div className='space-y-6'>
      <h1 className='font-bold text-3xl'>Заказы</h1>
      <OrdersTable />
    </div>
  );
}
