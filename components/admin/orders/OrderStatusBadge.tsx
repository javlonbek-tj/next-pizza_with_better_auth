'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <Badge variant='outline' className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  );
}
