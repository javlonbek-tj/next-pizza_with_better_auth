import { CheckoutDetails } from '@/components/checkout/checkout-details';
import { CheckoutTotal } from '@/components/checkout/checkout-total';
import { Container, Title } from '@/components/shared';

export default function CheckoutPage() {
  return (
    <Container className='mt-10'>
      <Title text='Оформление заказа' size='lg' className='font-bold' />
      <div className='flex gap-6 mt-6'>
        <CheckoutDetails />
        <CheckoutTotal />
      </div>
    </Container>
  );
}
