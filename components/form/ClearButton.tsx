import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  onClick?: () => void;
}

export function ClearButton({ className, onClick }: Props) {
  return (
    <button
      className={cn(
        'top-1/2 right-4 absolute opacity-30 hover:opacity-100 -translate-y-1/2 cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      <X className="w-4 h-4" />
    </button>
  );
}
