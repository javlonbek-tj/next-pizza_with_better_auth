
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

interface Props {
  open: boolean;
  onClose: () => void;
  order: any;
}

export function OrderDetailsDialog({ open, onClose, order }: Props) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  if (!order) return null;

  const handleUpdateStatus = () => {
    updateStatus(
      { id: order.id, status },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Order Details #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Customer Info */}
          <div>
            <h3 className='font-semibold mb-2'>Customer Information</h3>
            <div className='space-y-1 text-sm'>
              <p>
                <span className='text-gray-500'>Name:</span> {order.fullName}
              </p>
              <p>
                <span className='text-gray-500'>Email:</span> {order.email}
              </p>
              <p>
                <span className='text-gray-500'>Phone:</span> {order.phone}
              </p>
              <p>
                <span className='text-gray-500'>Address:</span> {order.address}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className='font-semibold mb-2'>Order Items</h3>
            <div className='border rounded-lg divide-y'>
              {order.items?.map((item: any) => (
                <div key={item.id} className='p-3 flex justify-between'>
                  <div>
                    <p className='font-medium'>{item.productName}</p>
                    <p className='text-sm text-gray-500'>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className='font-semibold'>${item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className='font-semibold mb-2'>Order Status</h3>
            <div className='flex items-center gap-4'>
              <OrderStatusBadge status={order.status} />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className='w-[200px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='processing'>Processing</SelectItem>
                  <SelectItem value='completed'>Completed</SelectItem>
                  <SelectItem value='cancelled'>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleUpdateStatus}
                disabled={isPending || status === order.status}
              >
                {isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Update Status
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className='border-t pt-4'>
            <div className='flex justify-between text-lg font-bold'>
              <span>Total:</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
