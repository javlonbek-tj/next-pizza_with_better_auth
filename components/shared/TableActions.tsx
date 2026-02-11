import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface TableActionsProps {
  edit: () => void;
  deleteAction: () => void;
  disabled?: boolean;
}

export function TableActions({
  edit,
  deleteAction,
  disabled,
}: TableActionsProps) {
  return (
    <>
      <Button
        className='cursor-pointer'
        variant='outline'
        size='sm'
        onClick={() => edit()}
      >
        <Edit className='w-4 h-4' />
      </Button>
      <Button
        className='cursor-pointer'
        variant='destructive'
        size='sm'
        onClick={() => deleteAction()}
        disabled={disabled}
      >
        <Trash2 className='w-4 h-4' />
      </Button>
    </>
  );
}
