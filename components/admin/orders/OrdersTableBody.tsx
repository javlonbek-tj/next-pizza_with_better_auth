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

export function OrdersTableBody({
  orders,
  isPending,
  isLoading,
  onView,
}: Props) {
  if (isPending) {
    return <TableBodySkeleton colSpan={6} />;
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
            colSpan={6}
            className='px-6 py-12 text-sm font-medium text-center text-gray-800'
          >
            Заказы не найдены
          </td>
        </tr>
      ) : (
        orders.map((order) => (
          <tr
            key={order.id}
            className='transition-all duration-200 group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white'
          >
            <td className='px-6 py-2 font-mono text-xs text-gray-600 whitespace-nowrap'>
              #{order.id.slice(0, 8)}
            </td>
            <td className='px-6 py-2 text-xs whitespace-nowrap'>
              <p className='font-bold text-gray-800'>
                {order.firstName} {order.lastName}
              </p>
              <p className='text-[10px] text-gray-500'>{order.email}</p>
            </td>
            <td className='px-6 py-2 text-xs font-bold text-gray-700 whitespace-nowrap'>
              {order.totalAmount.toLocaleString('ru-RU')} ₽
            </td>
            <td className='px-6 py-2 text-xs whitespace-nowrap'>
              <p className='text-gray-700'>
                {new Date(order.createdAt).toLocaleDateString('ru-RU')}
              </p>
              <p className='text-[10px] text-gray-500'>
                {new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </td>
            <td className='px-6 py-2 text-center whitespace-nowrap'>
              <OrderStatusBadge status={order.status} />
            </td>
            <td className='px-6 py-2 pr-15 whitespace-nowrap'>
              <TableActions onView={() => onView(order)} />
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
