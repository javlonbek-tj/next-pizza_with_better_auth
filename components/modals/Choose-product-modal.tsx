'use client';

import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib';
import { ProductForm } from '../product';

import { ProductWithRelations } from '@/prisma/@types/prisma';

interface Props {
  className?: string;
  product: ProductWithRelations;
}

export function ChooseProductModal({ className, product }: Props) {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        size='xl'
        className={cn('p-0 min-h-[500px] overflow-hidden', className)}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className='sr-only'>
          Choose {product?.name || 'Product'}
        </DialogTitle>
        <ProductForm product={product} isModal={true} />
      </DialogContent>
    </Dialog>
  );
}
