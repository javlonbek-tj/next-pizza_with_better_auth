import { Suspense } from 'react';
import { getUsersTableData } from '@/server';
import { Users } from '@/components/admin';

type SearchParams = Promise<{ search?: string; page?: string; limit?: string }>;

async function UsersLoader({ searchParams }: { searchParams: SearchParams }) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getUsersTableData(search, Number(page), Number(limit));
  return <Users dataPromise={dataPromise} />;
}

export default function UsersPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <UsersLoader searchParams={searchParams} />
    </Suspense>
  );
}
