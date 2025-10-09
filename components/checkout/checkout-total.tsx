import { CheckoutCard } from './checkout-card';

export function CheckoutTotal() {
  return (
    <CheckoutCard
      title='Итого:'
      className='width-[450px]'
      endAdornment={<span className='font-extrabold text-2xl'>123 ₽</span>}
    >
      123
    </CheckoutCard>
  );
}
