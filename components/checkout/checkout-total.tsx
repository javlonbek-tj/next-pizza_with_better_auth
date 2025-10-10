import { Package, Truck } from 'lucide-react';
import { CheckoutCard } from './checkout-card';
import { CheckoutPriceInfo } from './checkout-price-info';
import { Button } from '../ui/button';

export function CheckoutTotal() {
  return (
    <div className='basis-1/3'>
      <CheckoutCard
        title='Итого:'
        endAdornment={<span className='font-extrabold text-2xl'>123 ₽</span>}
      >
        <div className='flex flex-col gap-5 my-5'>
          <CheckoutPriceInfo
            title={
              <div className='flex items-center gap-2'>
                <Package size={18} className=' text-gray-400' />
                Стоимость корзины:
              </div>
            }
            value='123 ₽'
          />

          <CheckoutPriceInfo
            title={
              <div className='flex items-center gap-2'>
                <Truck size={18} className=' text-gray-400' />
                Доставка:
              </div>
            }
            value='123 ₽'
          />
          <hr className='-mx-7 mt-5 border-gray-100' />

          <Button className='h-12 rounded-2xl mt-6 text-base font-bold cursor-pointer'>
            Оформить заказ
          </Button>
        </div>
      </CheckoutCard>
    </div>
  );
}
