'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DeleteDialog } from '@/components/shared';
import { TableBodySkeleton } from '@/components/skeletons';
import { deleteUser } from '@/app/actions/admin';
import { useDelete } from '@/hooks';
import { useTableFilters } from '@/hooks/table';
import { SimpleTableFilters } from '../table/SimpleTableFilters';
import { TablePaginationAsync } from '../table/TablePaginationAsync';
import { UsersTable } from './UsersTable';
import { UsersTableBody } from './UsersTableBody';
import type { UserTableRow } from '@/types';

interface Props {
  dataPromise: Promise<{ data: UserTableRow[]; total: number }>;
  currentUserId: string;
}

export function Users({ dataPromise, currentUserId }: Props) {
  const searchParams = useSearchParams();
  const { handleSearch, isLoading, setIsPending } = useTableFilters();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const startIndex = (page - 1) * limit;

  const { isDeleting, handleDelete } = useDelete(deleteUser, {
    onSuccess: () => setDeleteId(null),
    successMessage: 'Пользователь успешно удалён',
    errorMessage: 'Ошибка удаления пользователя',
  });

  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        <SimpleTableFilters
          search={search}
          handleSearch={handleSearch}
          placeholder='Поиск пользователей...'
        />

        <div className='p-4 overflow-hidden'>
          <UsersTable>
            <Suspense fallback={<TableBodySkeleton colSpan={8} />}>
              <UsersTableBody
                dataPromise={dataPromise}
                startIndex={startIndex}
                isLoading={isLoading}
                currentUserId={currentUserId}
                onDelete={setDeleteId}
              />
            </Suspense>
          </UsersTable>

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

      <DeleteDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId!)}
        isDeleting={isDeleting}
        title='Удалить пользователя'
        description='Вы уверены, что хотите удалить этого пользователя? Все его данные, включая заказы и корзину, будут удалены.'
      />
    </div>
  );
}
