import { Trash2Icon } from 'lucide-react';
import { useRemoveCartItem } from '@/hooks';
import { cn } from '@/lib/utils';
import { useCheckoutState } from '@/store/checkout-state';
import { useEffect } from 'react';

interface Props {
  className?: string;
  id: string;
}

export function RemoveCartItem({ className, id }: Props) {
  const { mutate: removeCartItem, isPending } = useRemoveCartItem();
  const { setIsProcessing } = useCheckoutState();

  useEffect(() => {
    setIsProcessing(isPending);
  }, [isPending, setIsProcessing]);

  return (
    <div
      className={cn(
        'cursor-pointer hover:text-red-600 transition-colors',
        { 'pointer-events-none opacity-50': isPending },
        className
      )}
      onClick={() => removeCartItem({ id })}
    >
      <Trash2Icon size={16} />
    </div>
  );
}
