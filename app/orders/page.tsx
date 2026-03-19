import { Container, Title } from '@/components/shared';
import { UserOrders } from '@/components/orders/UserOrders';

export const metadata = { title: 'Мои заказы' };

export default function OrdersPage() {
  return (
    <Container className='py-10'>
      <Title text='Мои заказы' size='lg' className='mb-4 font-bold' />
      <UserOrders />
    </Container>
  );
}
