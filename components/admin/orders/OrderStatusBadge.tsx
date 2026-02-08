'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  PENDING: { label: 'Ожидание', className: 'bg-yellow-100 text-yellow-800' },
  SUCCEEDED: { label: 'Оплачен', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Отменен', className: 'bg-red-100 text-red-800' },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <Badge variant='outline' className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
