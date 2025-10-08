'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib';
import { ProductForm } from '../product';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useEffect, useState } from 'react';

interface Props {
  className?: string;
  product: ProductWithRelations;
}

export function ChooseProductModal({ className, product }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(!!product);

  useEffect(() => {
    if (product) {
      setOpen(true);
    }
  }, [product]);

  const handleClose = () => {
    setOpen(false);
    const queryString = searchParams.toString();
    const targetPath = queryString ? `/?${queryString}` : '/';

    router.push(targetPath, { scroll: false });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
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
