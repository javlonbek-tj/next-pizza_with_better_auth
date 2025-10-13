'use client';

import { CheckoutCard } from './checkout-card';
import { FormField } from '../form/form-field';

export function CheckoutPersonalInfo() {
  return (
    <CheckoutCard title="2. Персональные данные">
      <div className="gap-5 grid grid-cols-2">
        <FormField label="Имя" name="firstName" placeholder="Имя" required />

        <FormField
          label="Телефон"
          name="phone"
          placeholder="Телефон"
          isPhone
          required
        />
      </div>
    </CheckoutCard>
  );
}
