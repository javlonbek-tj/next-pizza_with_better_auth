'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib';
import { useModalRoute } from '@/hooks';

interface Props {
  className?: string;
  children: React.ReactNode;
  title?: string;
}

export function ChooseProductModal({
  className,
  children,
  title,
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
        size="xl"
        className={cn('flex flex-col p-0 h-[620px] overflow-hidden', className)}
      >
        <DialogTitle className="sr-only">
          {title || 'Choose Product'}
        </DialogTitle>

        {children}
      </DialogContent>
    </Dialog>
  );
}
