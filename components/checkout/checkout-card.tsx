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
    <div className={cn('bg-white rounded-3xl', className)}>
      {title && (
        <div className="flex justify-between items-center gap-4 p-5 px-7 border-gray-100 border-b">
          <Title text={title} size="sm" className="font-bold" />
          {endAdornment}
        </div>
      )}

      <div className={cn('p-5 px-7', contentClassName)}>{children}</div>
    </div>
  );
}
