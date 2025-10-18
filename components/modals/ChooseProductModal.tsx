'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib';
import { ProductForm } from '../product';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useEffect, useState, useRef } from 'react';

interface Props {
  className?: string;
  product: ProductWithRelations;
}

export function ChooseProductModal({ className, product }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hasBeenClosed = useRef(false);

  useEffect(() => {
    // Only open if we're on a product route and haven't manually closed
    if (product && pathname.includes('/product/') && !hasBeenClosed.current) {
      setOpen(true);
    } else {
      setOpen(false);
      hasBeenClosed.current = false;
    }
  }, [product, pathname]);

  const handleClose = () => {
    hasBeenClosed.current = true;
    setOpen(false);

    const queryString = searchParams.toString();
    const targetPath = queryString ? `/?${queryString}` : '/';
    router.push(targetPath, { scroll: false });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
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
