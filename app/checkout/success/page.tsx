import { Suspense } from 'react';
import { CheckoutSuccess } from './CheckoutSuccess';

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccess />
    </Suspense>
  );
}
