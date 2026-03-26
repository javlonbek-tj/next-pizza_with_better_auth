'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactStories from 'react-insta-stories';
import { X } from 'lucide-react';
import { AddButton, DeleteDialog } from '@/components/shared';
import { TableBodySkeleton } from '@/components/skeletons';
import { deleteStory } from '@/app/actions';
import { useDelete } from '@/hooks';
import { useTableActions, useTableFilters } from '@/hooks/table';
import { TablePaginationAsync } from '../table/TablePaginationAsync';
import { StoriesTable } from './StoriesTable';
import { StoriesTableBody } from './StoriesTableBody';
import { StoryFormDialog } from './StoryFormDialog';
import type { IStory } from '@/types';

interface Props {
  dataPromise: Promise<{ data: IStory[]; total: number }>;
}

export function Stories({ dataPromise }: Props) {
  const searchParams = useSearchParams();
  const { isLoading, setIsPending } = useTableFilters();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const startIndex = (page - 1) * limit;

  const [previewStory, setPreviewStory] = useState<IStory | null>(null);

  const {
    editingItem: editingStory,
    deleteId,
    isFormOpen,
    handleEdit,
    handleCreate,
    handleCloseForm,
    handleOpenDelete,
    handleCloseDelete,
  } = useTableActions<IStory>();

  const { isDeleting, handleDelete } = useDelete(deleteStory, {
    onSuccess: handleCloseDelete,
    successMessage: 'История успешно удалена',
    errorMessage: 'Ошибка при удалении истории',
  });

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <AddButton onClick={handleCreate} text='история' />
      </div>

      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        <div className='p-4 overflow-hidden'>
          <StoriesTable>
            <Suspense fallback={<TableBodySkeleton colSpan={6} />}>
              <StoriesTableBody
                dataPromise={dataPromise}
                startIndex={startIndex}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleOpenDelete}
                onPreview={setPreviewStory}
              />
            </Suspense>
          </StoriesTable>

          <Suspense fallback={null}>
            <TablePaginationAsync
              dataPromise={dataPromise}
              page={page}
              limit={limit}
              isLoading={isLoading}
              setIsPending={setIsPending}
            />
          </Suspense>
        </div>
      </div>

      <StoryFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        story={editingStory}
      />

      <DeleteDialog
        open={!!deleteId}
        onClose={handleCloseDelete}
        onConfirm={() => handleDelete(deleteId!)}
        isDeleting={isDeleting}
        title='Удалить историю'
        description='Вы уверены, что хотите удалить эту историю? Все слайды будут удалены. Это действие нельзя отменить.'
      />

      {/* Story Preview Modal */}
      {previewStory && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
          <div className='relative' style={{ width: 520 }}>
            <button
              className='absolute z-30 cursor-pointer -right-10 -top-5'
              onClick={() => setPreviewStory(null)}
            >
              <X className='w-8 h-8 transition-colors text-white/50 hover:text-white' />
            </button>
            <ReactStories
              onAllStoriesEnd={() => setPreviewStory(null)}
              stories={previewStory.items.map((item) => ({
                url: item.sourceUrl,
              }))}
              defaultInterval={3000}
              width={520}
              height={800}
            />
          </div>
        </div>
      )}
    </div>
  );
}
