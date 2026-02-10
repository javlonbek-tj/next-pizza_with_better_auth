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
import { AlertCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  showAlert?: boolean;
  alertDescription?: string;
}

export function DeleteDialog({
  open,
  onClose,
  onConfirm,
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
            className={`cursor-pointer min-w-[90px] transition-colors hover:bg-muted`}
          >
            Отмена
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            className='min-w-[100px] cursor-pointer'
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
