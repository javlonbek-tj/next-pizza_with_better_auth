import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export function CheckoutCartItems({ className }: Props) {
  return <div className={cn(className)}></div>;
}
