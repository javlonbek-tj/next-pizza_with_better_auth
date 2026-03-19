'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationWrapper } from '@/components/admin/table/PaginationWrapper';
import { ORDER_STATUS_OPTIONS } from '@/lib/constants';
import { useTableFilters } from '@/hooks/table';
import { useOrders } from '@/hooks/admin/use-orders';
import { OrdersTable } from './OrdersTable';
import { OrdersTableBody } from './OrdersTableBody';
import { OrderDetailsDialog } from './OrderDetailsDialog';
import type { OrderWithItems } from '@/types';

export function Orders() {
  const searchParams = useSearchParams();
  const { handleSearch, handleFilterChange, isLoading, setIsPending } =
    useTableFilters();
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
    null,
  );

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isPending } = useOrders({
    page,
    limit,
    status: status === 'all' ? undefined : status.toUpperCase(),
    search: search || undefined,
  });

  const orders = data?.orders ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        {/* Filter bar */}
        <div className='relative flex items-center gap-3 p-4 border-b'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute w-4 h-4 text-gray-400 -translate-y-1/2 top-1/2 left-3' />
            <Input
              placeholder='Поиск по имени или email...'
              className='text-xs shadow-xs pl-9 h-9 2xl:text-sm'
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete='off'
            />
          </div>
          <Select
            value={status}
            onValueChange={(val) => handleFilterChange('status', val)}
          >
            <SelectTrigger className='text-xs shadow-xs w-44 h-9 2xl:text-sm'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                { value: 'all', label: 'Все заказы' },
                ...ORDER_STATUS_OPTIONS,
              ].map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value.toLowerCase()}
                  className='text-xs 2xl:text-sm'
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='p-4 overflow-hidden'>
          <OrdersTable>
            <OrdersTableBody
              orders={orders}
              isPending={isPending}
              isLoading={isLoading}
              onView={setSelectedOrder}
            />
          </OrdersTable>

          {totalPages > 1 && (
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
          )}
        </div>
      </div>

      <OrderDetailsDialog
        key={selectedOrder?.id}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
