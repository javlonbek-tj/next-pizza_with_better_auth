import { useCart } from '@/hooks';

export function CheckoutCartItem() {
  const { data } = useCart();
  return <div className='flex justify-between gap-4'></div>;
}
