import { Suspense } from 'react';
import { getUsersTableData } from '@/server';
import { Users } from '@/components/admin';

async function UsersContent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const { search = '', page = '1', limit = '10' } = await searchParams;
  const dataPromise = getUsersTableData(search, Number(page), Number(limit));
  return <Users dataPromise={dataPromise} />;
}

export default function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  return (
    <Suspense>
      <UsersContent searchParams={searchParams} />
    </Suspense>
  );
}
