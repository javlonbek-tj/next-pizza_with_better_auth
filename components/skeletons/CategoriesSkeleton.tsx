import { cn } from '@/lib';

interface Props {
  className?: string;
}

export function CategoriesSkeleton({ className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-gray-50 p-1 rounded-xl',
        className,
      )}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 rounded-xl w-24 h-8 animate-pulse"
        />
      ))}
    </div>
  );
}
