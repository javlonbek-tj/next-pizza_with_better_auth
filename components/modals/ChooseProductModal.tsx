'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib';
import { ProductForm } from '../product';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useModalRoute } from '@/hooks';
import { ChoosePizzaFormSkeleton } from '../skeletons';
import { PizzaSize, PizzaType } from '@/lib/generated/prisma';

interface Props {
  className?: string;
  product: ProductWithRelations | undefined;
  isPending: boolean;
  pizzaSizes?: PizzaSize[];
  pizzaTypes?: PizzaType[];
}

export function ChooseProductModal({
  className,
  product,
  isPending,
  pizzaSizes,
  pizzaTypes,
}: Props) {
  const { open, handleClose } = useModalRoute('/product/');

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent
        size='xl'
        className={cn('p-0 h-[600px] flex flex-col', className)}
      >
        <DialogTitle className='sr-only'>
          Choose {product?.name || 'Product'}
        </DialogTitle>

        {isPending ? (
          <ChoosePizzaFormSkeleton isModal={true} />
        ) : product ? (
          <ProductForm
            product={product}
            isModal={true}
            onClose={handleClose}
            isPending={isPending}
            pizzaSizes={pizzaSizes}
            pizzaTypes={pizzaTypes}
          />
        ) : (
          <div className='flex flex-col items-center justify-center min-h-[500px] gap-4'>
            <p className='text-lg text-gray-500'>Продукт не найден</p>
            <button
              onClick={handleClose}
              className='px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary/90'
            >
              Закрыть
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
