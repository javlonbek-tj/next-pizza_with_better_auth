// components/admin/products/DeleteDialog.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  description: string;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title,
  description,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className={`cursor-pointer min-w-[90px] transition-colors ${
              isDeleting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-muted'
            }`}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="min-w-[100px] cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="mx-auto w-4 h-4 animate-spin" />
            ) : (
              'Удалить'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
