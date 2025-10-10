'use client';

import { CheckoutCard } from './checkout-card';
import { FormField } from '../form/form-field';

export function CheckoutPersonalInfo() {
  return (
    <CheckoutCard title='2. Персональные данные'>
      <div className='grid grid-cols-2 gap-5'>
        <FormField label='Имя' name='firstName' placeholder='Имя' required />
        <FormField
          label='Фамилия'
          name='lastName'
          placeholder='Фамилия'
          required
        />
        <FormField label='Email' name='email' placeholder='Email' required />
        <FormField
          label='Телефон'
          name='phone'
          placeholder='Телефон'
          isPhone
          required
        />
      </div>
    </CheckoutCard>
  );
}
