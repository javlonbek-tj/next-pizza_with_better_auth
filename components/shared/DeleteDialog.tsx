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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  title: string;
  description: string;
  showAlert?: boolean;
  alertDescription?: string;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
  isDeleting,
  title,
  description,
  showAlert = false,
  alertDescription,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {showAlert && (
          <Alert variant='destructive' className='my-4'>
            <AlertCircle className='w-4 h-4' />
            <AlertTitle>Внимание!</AlertTitle>
            <AlertDescription>{alertDescription}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isDeleting}
            className={`cursor-pointer min-w-[90px] transition-colors ${
              isDeleting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-muted'
            }`}
          >
            Отмена
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isDeleting}
            className='min-w-[100px] cursor-pointer'
          >
            {isDeleting ? (
              <Loader2 className='w-4 h-4 mx-auto animate-spin' />
            ) : (
              'Удалить'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
