import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export default function CheckoutPage({ className }: Props) {
  return <div className={cn(className)}>Hello</div>;
}
