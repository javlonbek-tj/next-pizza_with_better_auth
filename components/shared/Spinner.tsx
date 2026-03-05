'use client';

import { cn } from '@/lib/utils';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 32,
  lg: 48,
};

export function Spinner({ size = 'sm', className = '' }: Props) {
  const spinnerElement = (
    <div
      className={cn(
        'absolute inset-0 flex justify-center items-center',
        className,
      )}
    >
      <div
        className="border-primary border-b-2 rounded-full animate-spin"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      ></div>
    </div>
  );

  return spinnerElement;
}
