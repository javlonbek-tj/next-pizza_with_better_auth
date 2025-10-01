import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib';

interface Props {
  className?: string;
}

export function SortPopup({ className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-gray-50 px-5 py-3 rounded-2xl',
        className
      )}
    >
      <ArrowUpDown size={16} />
      <span>Сортировка:</span>
      <span className="text-primary">рейтингу</span>
    </div>
  );
}
