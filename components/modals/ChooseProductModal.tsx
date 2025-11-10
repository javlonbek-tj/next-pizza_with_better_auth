'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib';
import { ProductForm } from '../product';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useModalRoute } from '@/hooks';

interface Props {
  className?: string;
  product: ProductWithRelations;
}

export function ChooseProductModal({ className, product }: Props) {
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
        className={cn('p-0 min-h-[500px] overflow-hidden', className)}
      >
        <DialogTitle className='sr-only'>
          Choose {product?.name || 'Product'}
        </DialogTitle>
        <ProductForm product={product} isModal={true} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
