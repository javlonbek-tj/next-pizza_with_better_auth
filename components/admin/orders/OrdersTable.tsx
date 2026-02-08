'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/admin/use-orders';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,  
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
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

export function OrdersTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data, isPending } = useOrders({
    page,
    limit: 10,
    status: status === 'all' ? undefined : status,
  });

  const orders = (data as any[]) || [];

  if (isPending) {
    return (
      <div className='space-y-4'>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className='h-16 w-full' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Все заказы</SelectItem>
            <SelectItem value='PENDING'>В ожидании</SelectItem>
            <SelectItem value='SUCCEEDED'>Оплачен</SelectItem>
            <SelectItem value='CANCELLED'>Отменен</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='bg-white rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Номер заказа</TableHead>
              <TableHead>Покупатель</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead className='text-right'>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='font-mono text-sm'>
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div>
                    <p className='font-medium'>{order.firstName} {order.lastName}</p>
                    <p className='text-sm text-gray-500'>{order.email}</p>
                  </div>
                </TableCell>
                <TableCell className='font-semibold'>
                  {order.totalAmount} ₽
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className='w-4 h-4 mr-2' />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsDialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
