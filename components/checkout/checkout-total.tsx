import { CheckoutCard } from './checkout-card';

export function CheckoutTotal() {
  return (
    <div className="basis-1/3">
      <CheckoutCard
        title="Итого:"
        endAdornment={<span className="font-extrabold text-2xl">123 ₽</span>}
      >
        123
      </CheckoutCard>
    </div>
  );
}
