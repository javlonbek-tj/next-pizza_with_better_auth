import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface Props {
  className?: string;
  onClick?: VoidFunction;
  text?: string;
}

export function BackButton({
  className,
  onClick,
  text = 'Вернуться назад',
}: Props) {
  return (
    <Button
      className={cn('w-56 h-12 text-base cursor-pointer', className)}
      size="lg"
      onClick={onClick}
    >
      <ArrowLeft className="mr-2 w-5" />
      {text}
    </Button>
  );
}
