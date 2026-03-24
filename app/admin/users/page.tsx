import { connection } from 'next/server';
import { getUsersTableData } from '@/server';
import { getServerSession } from '@/lib/auth';
import { Users } from '@/components/admin';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}) {
  await connection();
  const { search = '', page = '1', limit = '10' } = await searchParams;

  const session = await getServerSession();
  const dataPromise = getUsersTableData(search, Number(page), Number(limit));

  return <Users dataPromise={dataPromise} currentUserId={session?.user.id ?? ''} />;
}
