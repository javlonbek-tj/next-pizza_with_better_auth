import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  className?: string;
  onClick?: VoidFunction;
  text?: string;
  size?: 'sm' | 'lg' | 'default';
}

export function BackButton({
  className,
  onClick,
  text = 'Вернуться назад',
  size = 'lg',
}: Props) {
  return (
    <Button
      className={cn('w-56 h-12 text-base cursor-pointer', className)}
      size={size}
      onClick={onClick}
    >
      <ArrowLeft className='mr-2 w-5' />
      {text}
    </Button>
  );
}
