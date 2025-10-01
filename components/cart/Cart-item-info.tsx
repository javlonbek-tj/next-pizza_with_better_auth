import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  name: string;
  details: string;
}

export function CartItemInfo({ className, name, details }: Props) {
  return (
    <div className={cn(className)}>
      <h2 className="text-md">{name}</h2>
      {details && <p className="text-gray-400 text-sm">{details}</p>}
    </div>
  );
}
