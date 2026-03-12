'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableActions } from '@/components/admin/table/TableActions';

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
}

export function OrdersTable() {
  const page = 1;
  const [status, setStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isPending } = useOrders(
    {
      page,
      limit: 10,
      status: status === 'all' ? undefined : status,
    },
    {
      refetchInterval: 10000,
    },
  );

  const orders = data || [];

  if (isPending) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-16" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="shadow-xs w-50 h-9 text-xs 2xl:text-sm">
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent className="dark:text-white">
            <SelectItem value="all" className="text-xs 2xl:text-sm">
              Все заказы
            </SelectItem>
            <SelectItem value="PENDING" className="text-xs 2xl:text-sm">
              В ожидании
            </SelectItem>
            <SelectItem value="SUCCEEDED" className="text-xs 2xl:text-sm">
              Оплачен
            </SelectItem>
            <SelectItem value="CANCELLED" className="text-xs 2xl:text-sm">
              Отменен
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="relative w-full border-collapse">
            <thead className="top-0 z-10 sticky bg-gray-100/80 backdrop-blur-md border-gray-200 border-b">
              <tr>
                <th className="px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest">
                  Номер заказа
                </th>
                <th className="px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest">
                  Покупатель
                </th>
                <th className="px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-left uppercase leading-none tracking-widest">
                  Сумма
                </th>
                <th className="px-6 py-4 font-bold text-[10px] text-gray-900 3xl:text-xs text-center uppercase leading-none tracking-widest">
                  Статус
                </th>
                <th className="px-6 py-4 pr-8 2xl:pr-10 font-bold text-[10px] text-gray-900 3xl:text-xs text-right uppercase leading-none tracking-widest">
                  Действия
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 font-medium text-gray-800 text-sm text-center"
                  >
                    Заказы не найдены
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-blue-50/30 even:bg-gray-50/50 odd:bg-white transition-all duration-200"
                  >
                    <td className="px-6 py-2 font-mono text-gray-600 text-xs whitespace-nowrap">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-2 text-xs whitespace-nowrap">
                      <div>
                        <p className="font-bold text-gray-800">
                          {order.firstName} {order.lastName}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {order.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-2 font-bold text-gray-700 text-xs whitespace-nowrap">
                      {order.totalAmount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-6 py-2 text-center whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <TableActions onView={() => setSelectedOrder(order)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailsDialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
