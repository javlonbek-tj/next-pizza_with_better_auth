'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatusBadge } from './OrderStatusBadge';
import { useUpdateOrderStatus } from '@/hooks/admin/use-orders';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { OrderRow } from '@/hooks/admin/use-orders';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'В ожидании' },
  { value: 'SUCCEEDED', label: 'Оплачен' },
  { value: 'CANCELLED', label: 'Отменён' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  order: OrderRow | null;
}

export function OrderDetailsDialog({ open, onClose, order }: Props) {
  const [status, setStatus] = useState(order?.status || 'PENDING');
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  if (!order) return null;

  const onStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id: order.id, status: newStatus });
      onClose();
    } catch {
      setStatus(order.status);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Заказ #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Customer info */}
          <div>
            <h3 className='mb-2 font-semibold text-sm'>Информация о покупателе</h3>
            <div className='space-y-1 text-sm'>
              <p>
                <span className='text-gray-500'>Имя: </span>
                {order.firstName} {order.lastName}
              </p>
              <p>
                <span className='text-gray-500'>Email: </span>
                {order.email}
              </p>
              <p>
                <span className='text-gray-500'>Телефон: </span>
                {order.phone}
              </p>
              <p>
                <span className='text-gray-500'>Адрес: </span>
                {order.address}
              </p>
              {order.comment && (
                <p>
                  <span className='text-gray-500'>Комментарий: </span>
                  {order.comment}
                </p>
              )}
            </div>
          </div>

          {/* Order items */}
          <div>
            <h3 className='mb-2 font-semibold text-sm'>Состав заказа</h3>
            <div className='border rounded-lg divide-y'>
              {order.items.map((item) => (
                <div key={item.id} className='flex justify-between items-center p-3'>
                  <div>
                    <p className='font-medium text-sm'>
                      {item.productItem.product.name}
                    </p>
                    <p className='text-gray-500 text-xs'>
                      Количество: {item.quantity}
                    </p>
                  </div>
                  <p className='font-semibold text-sm'>
                    {item.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className='mb-2 font-semibold text-sm'>Статус заказа</h3>
            <div className='flex items-center gap-4'>
              <OrderStatusBadge status={order.status} />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className='w-44'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => onStatusChange(status)}
                disabled={isUpdating || status === order.status}
              >
                {isUpdating && <Loader2 className='mr-2 w-4 h-4 animate-spin' />}
                Сохранить
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className='pt-4 border-t'>
            <div className='flex justify-between font-bold text-base'>
              <span>Итого:</span>
              <span>{order.totalAmount.toLocaleString('ru-RU')} ₽</span>
            </div>
            {order.deliveryPrice > 0 && (
              <div className='flex justify-between text-sm text-gray-500 mt-1'>
                <span>Доставка:</span>
                <span>{order.deliveryPrice.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
