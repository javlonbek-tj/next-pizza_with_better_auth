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
        <div className='flex justify-between gap-4 items-center p-5 px-7 border-b border-gray-100'>
          <Title text={title} size='md' className='font-semibold' />
          {endAdornment}
        </div>
      )}

      <div className={cn('p-5 px-7', contentClassName)}>{children}</div>
    </div>
  );
}
