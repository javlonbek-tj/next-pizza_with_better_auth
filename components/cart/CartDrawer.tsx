import { ArrowRight, Loader2 } from 'lucide-react'; // ⬅️ import spinner icon
import { PropsWithChildren, useState } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartDrawerItem } from './CartDrawerItem';
import { calculateTotalAmount, getCartItemDetails } from '@/lib/cart';
import { useCart } from '@/hooks';
import { cn } from '@/lib';
import { queryKeys } from '@/lib/constants';
import { EmptyCart } from './index';
import { AuthModal } from '../modals/AuthModal';
import { authClient } from '@/lib/auth-client';

export function CartDrawer({ children }: PropsWithChildren) {
  const [authOpen, setAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data } = useCart();

  const isDeleting =
    useIsMutating({
      mutationKey: queryKeys.cart,
    }) > 0;

  const handleClick = async () => {
    setIsLoading(true); // Show loader IMMEDIATELY

    try {
      const currentSession = await authClient.getSession();
      const isAuthenticated = !!currentSession?.data?.session?.userId;

      if (!isAuthenticated) {
        setAuthOpen(true);
      } else {
        router.push('/checkout');
        router.refresh();
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setAuthOpen(true);
    } finally {
      setIsLoading(false); // Always hide loader
    }
  };

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
              <div className="flex flex-col gap-4 overflow-auto scrollbar-thin">
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
                <div className="flex justify-between items-center gap-4 mb-4">
                  <span>Итого</span>
                  <span className="top-1 relative flex-1 border-b border-b-neutral-200 border-dashed"></span>
                  <span className="font-bold">{totalAmount} ₽</span>
                </div>

                <Button
                  className="h-12 cursor-pointer"
                  onClick={handleClick}
                  disabled={isLoading || isDeleting} // Disable during loading or mutation
                >
                  <span className="flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Проверка...</span>
                      </>
                    ) : (
                      <>
                        <span>Оформить заказ</span>
                        <ArrowRight />
                      </>
                    )}
                  </span>
                </Button>
              </SheetFooter>

              <AuthModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
                callbackUrl="/checkout"
              />
            </>
          )}
        </>
      </SheetContent>
    </Sheet>
  );
}
