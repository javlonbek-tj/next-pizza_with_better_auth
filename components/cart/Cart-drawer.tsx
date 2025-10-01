'use client';

import { ArrowRight } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartDrawerItem } from '../cart';

import { calculateTotalAmount, getCartItemDetails } from '@/lib/cart';
import { useCart } from '../hooks';
import { cn } from '@/lib';

import { queryKeys } from '@/constants';
import { EmptyCart } from './Empty-cart';

export function CartDrawer({ children }: PropsWithChildren) {
  const { data } = useCart();
  const isDeleting =
    useIsMutating({
      mutationKey: queryKeys.removeCartItem,
    }) > 0;

  const totalAmount = data ? calculateTotalAmount(data) : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={cn(
          'bg-[#F4F1EE] pb-0',
          !totalAmount && 'flex items-center justify-center'
        )}
      >
        <>
          <SheetHeader>
            <SheetTitle className={totalAmount > 0 ? '' : 'sr-only'}>
              {totalAmount > 0
                ? data?.length === 1
                  ? `В корзине ${data?.length} товар`
                  : `В корзине ${data?.length} товара`
                : 'Корзина'}
            </SheetTitle>
          </SheetHeader>

          {!totalAmount && <EmptyCart />}

          {totalAmount > 0 && (
            <>
              <div className='flex flex-col gap-4 overflow-auto scrollbar-thin'>
                {data?.map((item) => (
                  <CartDrawerItem
                    key={item.id}
                    {...item}
                    details={getCartItemDetails(
                      item.ingredients,
                      item.pizzaSize,
                      item.pizzaType
                    )}
                  />
                ))}
              </div>

              <SheetFooter
                className={cn('bg-white p-6', {
                  'opacity-60 pointer-events-none': isDeleting,
                })}
              >
                <div className='flex justify-between items-center gap-4 mb-4'>
                  <span>Итого</span>
                  <span className='top-1 relative flex-1 border-b border-b-neutral-200 border-dashed'></span>
                  <span className='font-bold'>{totalAmount} ₽</span>
                </div>
                <Button className='h-12 cursor-pointer'>
                  <ArrowRight className='mr-2 w-5' />
                  Оформить заказ
                </Button>
              </SheetFooter>
            </>
          )}
        </>
      </SheetContent>
    </Sheet>
  );
}
