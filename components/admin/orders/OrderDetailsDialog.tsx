'use client';

import { useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
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
import {
  Loader2,
  User,
  MapPin,
  ShoppingBag,
  CreditCard,
  Calendar,
} from 'lucide-react';
import type { OrderRow } from '@/hooks/admin/use-orders';
import Image from 'next/image';
import { updateOrderStatus } from '@/app/actions/order';
import { OrderStatus } from '@/lib/generated/prisma/enums';
import { ORDER_STATUS_OPTIONS } from '@/lib/constants';

interface Props {
  open: boolean;
  onClose: () => void;
  order: OrderRow | null;
}

export function OrderDetailsDialog({ open, onClose, order }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(order?.status || 'PENDING');
  const queryClient = useQueryClient();

  if (!order) return null;

  const onStatusChange = () => {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, status as OrderStatus);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
        toast.success('Статус заказа обновлён');
        onClose();
      } else {
        toast.error(result.message ?? 'Ошибка при обновлении статуса');
        setStatus(order.status);
      }
    });
  };

  const createdDate = new Date(order.createdAt);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl gap-0 p-0 overflow-visible'>
        <div className='overflow-hidden rounded-lg'>
          {/* Header */}
          <div className='px-6 py-5 bg-linear-to-r from-gray-900 to-gray-700'>
            <DialogHeader>
              <div className='flex items-center justify-between'>
                <DialogTitle className='text-lg font-bold text-white'>
                  Заказ{' '}
                  <span className='font-mono text-orange-400'>
                    #{order.id.slice(0, 8)}
                  </span>
                </DialogTitle>
                <div className='mr-8'>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>
              <div className='flex items-center gap-1.5 text-gray-400 text-xs mt-1'>
                <Calendar className='w-3.5 h-3.5' />
                <span>
                  {createdDate.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {' · '}
                  {createdDate.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </DialogHeader>
          </div>

          <div className='p-6 space-y-5 max-h-[70vh] overflow-y-auto'>
            {/* Customer info */}
            <div className='p-4 space-y-3 bg-gray-50 rounded-xl'>
              <div className='flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase'>
                <User className='w-3.5 h-3.5' />
                Покупатель
              </div>
              <div className='grid grid-cols-2 text-sm gap-x-6 gap-y-2'>
                <div>
                  <p className='text-[10px] text-gray-400 uppercase tracking-wide mb-0.5'>
                    Имя
                  </p>
                  <p className='font-medium text-gray-800'>
                    {order.firstName} {order.lastName}
                  </p>
                </div>
                <div>
                  <p className='text-[10px] text-gray-400 uppercase tracking-wide mb-0.5'>
                    Email
                  </p>
                  <p className='font-medium text-gray-800'>{order.email}</p>
                </div>
                <div>
                  <p className='text-[10px] text-gray-400 uppercase tracking-wide mb-0.5'>
                    Телефон
                  </p>
                  <p className='font-medium text-gray-800'>{order.phone}</p>
                </div>
                <div className='flex items-start gap-1.5'>
                  <div>
                    <p className='text-[10px] text-gray-400 uppercase tracking-wide mb-0.5'>
                      Адрес
                    </p>
                    <p className='flex items-start gap-1 font-medium text-gray-800'>
                      <MapPin className='w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0' />
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>
              {order.comment && (
                <div className='pt-2 border-t border-gray-200'>
                  <p className='text-[10px] text-gray-400 uppercase tracking-wide mb-0.5'>
                    Комментарий
                  </p>
                  <p className='text-sm italic text-gray-700'>
                    {order.comment}
                  </p>
                </div>
              )}
            </div>

            {/* Order items */}
            <div>
              <div className='flex items-center gap-2 mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase'>
                <ShoppingBag className='w-3.5 h-3.5' />
                Состав заказа
              </div>
              <div className='overflow-y-auto border border-gray-200 divide-y divide-gray-100 min-h-20 max-h-60 rounded-xl'>
                {order.items.map((item) => {
                  const { product, size, type } = item.productItem;
                  const meta = [size?.label, type?.type]
                    .filter(Boolean)
                    .join(', ');
                  return (
                    <div
                      key={item.id}
                      className='flex items-center gap-4 px-4 py-3 transition-colors bg-white hover:bg-gray-50/60'
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={56}
                        height={56}
                        className='object-cover border border-gray-100 rounded-full w-14 h-14 shrink-0'
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-semibold text-gray-900 truncate'>
                          {product.name}
                        </p>
                        {meta && (
                          <p className='text-xs text-gray-400 mt-0.5'>{meta}</p>
                        )}
                      </div>
                      <div className='text-right shrink-0'>
                        <p className='text-sm font-bold text-gray-900'>
                          {item.price.toLocaleString('ru-RU')} ₽
                        </p>
                        <p className='text-xs text-gray-400 mt-0.5'>
                          {item.quantity} шт.
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total + delivery */}
            <div className='px-4 py-3 space-y-2 bg-gray-50 rounded-xl'>
              <div className='flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-500 uppercase'>
                <CreditCard className='w-3.5 h-3.5' />
                Итог
              </div>
              {order.deliveryPrice > 0 && (
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>Доставка</span>
                  <span>{order.deliveryPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <div className='flex justify-between pt-1 text-base font-bold text-gray-900 border-t border-gray-200'>
                <span>К оплате</span>
                <span>{order.totalAmount.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            {/* Status change */}
            <div className='flex items-center gap-3 pt-1'>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className='w-48'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={onStatusChange}
                disabled={isPending || status === order.status}
                className={`flex-1 ${!isPending && status !== order.status ? 'cursor-pointer' : ''}`}
              >
                {isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Сохранить статус
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
