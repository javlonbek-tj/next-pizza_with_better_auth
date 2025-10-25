import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string;
  onClick?: VoidFunction;
  text: string;
  size?: 'sm' | 'lg' | 'default';
}

export function AddButton({
  className,
  onClick,
  text,
  size = 'default',
}: Props) {
  return (
    <Button
      onClick={onClick}
      className={cn('cursor-pointer', className)}
      size={size}
    >
      <Plus className='mr-2 w-4 h-4' />
      Добавить {text}
    </Button>
  );
}
