import { FormField } from '../form';
import { CheckoutCard } from './checkout-card';

export function CheckoutAddress() {
  return (
    <CheckoutCard title='3. Адрес доставки'>
      <div className='flex flex-col gap-5'>
        <FormField
          label='Адрес'
          name='address'
          placeholder='Город, улица, дом, кв'
          required
        />
        <FormField
          label='Комментарий'
          name='comment'
          placeholder='Комментарий'
          isTextArea
        />
      </div>
    </CheckoutCard>
  );
}
