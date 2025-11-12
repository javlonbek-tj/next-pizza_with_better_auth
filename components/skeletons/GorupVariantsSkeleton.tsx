import { cn } from '@/lib';

interface Props {
  className?: string;
  itemCount: number;
}

export function GroupVariantsSkeleton({ className, itemCount }: Props) {
  return (
    <div
      className={cn(
        'flex justify-between bg-gray-200 mt-2 p-0.5 rounded-full',
        className
      )}
    >
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="flex-1 px-4 py-1.5 rounded-full">
          <div className="bg-gray-300 rounded h-5 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
