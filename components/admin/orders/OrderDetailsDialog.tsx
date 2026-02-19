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
import { useUpdateOrderStatus } from '@/hooks';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  order: any;
}

export function OrderDetailsDialog({ open, onClose, order }: Props) {
  const [status, setStatus] = useState(order?.status || 'pending');
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  if (!order) return null;

  const onStatusChange = async (newStatus: string) => {
    setStatus(newStatus); // Optimistically update UI
    try {
      await updateStatus({ id: order.id, status: newStatus });
      toast.success('Статус заказа обновлен');
      onClose(); // Close dialog on successful update
    } catch (error) {
      console.error(error);
      toast.error('Не удалось обновить статус');
      setStatus(order.status); // Revert UI on error
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details #{order.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="mb-2 font-semibold">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-500">Name:</span> {order.fullName}
              </p>
              <p>
                <span className="text-gray-500">Email:</span> {order.email}
              </p>
              <p>
                <span className="text-gray-500">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="text-gray-500">Address:</span> {order.address}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="mb-2 font-semibold">Order Items</h3>
            <div className="border rounded-lg divide-y">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between p-3">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="mb-2 font-semibold">Order Status</h3>
            <div className="flex items-center gap-4">
              <OrderStatusBadge status={order.status} />
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => onStatusChange(status)}
                disabled={isUpdating || status === order.status}
              >
                {isUpdating && (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                )}
                Update Status
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
