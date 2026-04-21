'use client';

import { use } from 'react';
import { PaginationWrapper } from '@/components/admin/table/PaginationWrapper';
import type { ProductTableRow } from '@/types';

interface Props {
  productsPromise: Promise<{ data: ProductTableRow[]; total: number }>;
  page: number;
  limit: number;
  isLoading: boolean;
  setIsPending: (v: boolean) => void;
}

export function ProductPaginationAsync({
  productsPromise,
  page,
  limit,
  isLoading,
  setIsPending,
}: Props) {
  const { total } = use(productsPromise);
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div
      className={`transition-opacity duration-200 ${
        isLoading ? 'opacity-40 pointer-events-none' : ''
      }`}
    >
      <PaginationWrapper
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        itemsPerPage={limit}
        setIsPending={setIsPending}
      />
    </div>
  );
}
