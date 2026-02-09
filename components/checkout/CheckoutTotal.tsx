import { Package, Truck } from 'lucide-react';
import { CheckoutCard } from './CheckoutCard';
import { CheckoutPriceInfo } from './CheckoutPriceInfo';
import { Button } from '../ui/button';
import { calculateTotalAmount, DELIVERY_PRICE } from '@/lib';
import { CartItemModel } from '@/types';
import { cn } from '@/lib';

interface Props {
  cartItems: CartItemModel[];
  isProcessing?: boolean;
}

export function CheckoutTotal({ cartItems, isProcessing }: Props) {
  const totalCartPrice = calculateTotalAmount(cartItems);
  const totalPriceWithDelivery = totalCartPrice + DELIVERY_PRICE;
  const isDisabled = isProcessing || cartItems.length === 0;

  return (
    <div className="basis-1/3">
      <CheckoutCard
        title="Итого:"
        endAdornment={
          <span
            className={cn(
              'font-extrabold text-2xl transition-opacity',
              isProcessing && 'opacity-50'
            )}
          >
            {totalPriceWithDelivery} ₽
          </span>
        }
      >
        <div
          className={cn(
            'flex flex-col gap-5 my-5 transition-opacity duration-200',
            isProcessing && 'opacity-50'
          )}
        >
          <CheckoutPriceInfo
            title={
              <div className="flex items-center gap-2">
                <Package size={18} className="text-gray-400" />
                Стоимость корзины:
              </div>
            }
            value={<span className="font-semibold">{totalCartPrice} ₽</span>}
          />

          <CheckoutPriceInfo
            title={
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-gray-400" />
                Доставка:
              </div>
            }
            value={<span className="font-semibold">{DELIVERY_PRICE} ₽</span>}
          />

          <hr className="-mx-7 mt-5 border-gray-100" />

          <Button
            type="submit"
            className="mt-6 rounded-2xl h-12 font-bold text-base cursor-pointer"
            disabled={isDisabled}
          >
            Оформить заказ
          </Button>
        </div>
      </CheckoutCard>
    </div>
  );
}
