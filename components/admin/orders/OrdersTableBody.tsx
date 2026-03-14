'use client';

import { TableActions } from '@/components/admin/table/TableActions';
import { TableBodySkeleton } from '@/components/skeletons';
import { OrderStatusBadge } from './OrderStatusBadge';
import type { OrderRow } from '@/hooks/admin/use-orders';

interface Props {
  orders: OrderRow[];
  isPending: boolean;
  isLoading: boolean;
  onView: (order: OrderRow) => void;
}

export function OrdersTableBody({ orders, isPending, isLoading, onView }: Props) {
  if (isPending) {
    return <TableBodySkeleton colSpan={5} />;
  }

  return (
    <tbody
      className={`divide-y divide-gray-100 transition-opacity duration-200 ${
        isLoading && orders.length > 0 ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {orders.length === 0 ? (
        <tr>
          <td
            colSpan={5}
            className='px-6 py-12 font-medium text-gray-800 text-sm text-center'
          >
            Заказы не найдены
          </td>
        </tr>
      ) : (
        orders.map((order) => (
          <tr
            key={order.id}
            className='group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white transition-all duration-200'
          >
            <td className='px-6 py-2 font-mono text-gray-600 text-xs whitespace-nowrap'>
              #{order.id.slice(0, 8)}
            </td>
            <td className='px-6 py-2 text-xs whitespace-nowrap'>
              <p className='font-bold text-gray-800'>
                {order.firstName} {order.lastName}
              </p>
              <p className='text-[10px] text-gray-500'>{order.email}</p>
            </td>
            <td className='px-6 py-2 font-bold text-gray-700 text-xs whitespace-nowrap'>
              {order.totalAmount.toLocaleString('ru-RU')} ₽
            </td>
            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <OrderStatusBadge status={order.status} />
            </td>
            <td className='px-6 py-2 whitespace-nowrap'>
              <TableActions onView={() => onView(order)} />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
