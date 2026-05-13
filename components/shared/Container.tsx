import { PropsWithChildren } from 'react';
import { cn } from '@/lib';

interface Props {
  className?: string;
}

export function Container({ className, children }: PropsWithChildren<Props>) {
  return <div className={cn('mx-auto max-w-7xl px-4 lg:px-8', className)}>{children}</div>;
}
