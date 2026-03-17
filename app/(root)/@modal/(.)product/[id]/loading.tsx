import { ChooseProductModal } from '@/components/modals';
import { Spinner } from '@/components/shared';

export default function Loading() {
  return (
    <ChooseProductModal>
      <Spinner size='md' />
    </ChooseProductModal>
  );
}
