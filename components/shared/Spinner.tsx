'use client';

import { cn } from '@/lib';

interface Props {
  className?: string;
}

export const Spinner = ({ className }: Props) => {
  return (
    <div className={cn('flex justify-center', className)}>
      <div className='w-7 h-7 border-[3px] border-secondary border-t-primary rounded-full animate-spin' />
    </div>
  );
};
