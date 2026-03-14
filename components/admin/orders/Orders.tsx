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
import { useTableFilters } from '@/hooks/table';
import { useOrders } from '@/hooks/admin/use-orders';
import type { OrderRow } from '@/hooks/admin/use-orders';
import { OrdersTable } from './OrdersTable';
import { OrdersTableBody } from './OrdersTableBody';
import { OrderDetailsDialog } from './OrderDetailsDialog';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все заказы' },
  { value: 'PENDING', label: 'В ожидании' },
  { value: 'SUCCEEDED', label: 'Оплачен' },
  { value: 'CANCELLED', label: 'Отменён' },
];

export function Orders() {
  const searchParams = useSearchParams();
  const { handleSearch, handleFilterChange, isLoading, setIsPending } = useTableFilters();
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'all';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const { data, isPending } = useOrders(
    {
      page,
      limit,
      status: status === 'all' ? undefined : status,
      search: search || undefined,
    },
    { refetchInterval: 10000 },
  );

  const orders = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className='space-y-4'>
      <div className='bg-white rounded-lg shadow-sm dark:bg-gray-800'>
        {/* Filter bar */}
        <div className='relative flex items-center gap-3 p-4 border-b'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2' />
            <Input
              placeholder='Поиск по имени или email...'
              className='shadow-xs pl-9 h-9 text-xs 2xl:text-sm'
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              autoComplete='off'
            />
          </div>
          <Select
            value={status}
            onValueChange={(val) => handleFilterChange('status', val)}
          >
            <SelectTrigger className='shadow-xs w-44 h-9 text-xs 2xl:text-sm'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className='text-xs 2xl:text-sm'>
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
