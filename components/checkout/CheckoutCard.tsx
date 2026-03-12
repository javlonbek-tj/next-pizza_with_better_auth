import { cn } from '@/lib/utils';
import { Title } from '../shared';

interface Props {
  className?: string;
  title?: string;
  endAdornment?: React.ReactNode;
  contentClassName?: string;
  children: React.ReactNode;
}

export function CheckoutCard({
  className,
  title,
  endAdornment,
  contentClassName,
  children,
}: Props) {
  return (
    <div className={cn('bg-white rounded-2xl', className)}>
      {title && (
        <div className="flex justify-between items-center gap-4 px-7 py-3 border-gray-100 border-b">
          <Title text={title} size="xs" className="font-bold" />
          {endAdornment}
        </div>
      )}

      <div className={cn('px-7 py-3', contentClassName)}>{children}</div>
    </div>
  );
}
