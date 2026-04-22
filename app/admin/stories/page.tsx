import { Suspense } from 'react';
import { Stories } from '@/components/admin';
import { getStoriesTableData } from '@/server/data/stories';

type SearchParams = Promise<{ page?: string; limit?: string }>;

async function StoriesLoader({ searchParams }: { searchParams: SearchParams }) {
  const { page = '1', limit = '10' } = await searchParams;
  const dataPromise = getStoriesTableData(Number(page), Number(limit));
  return <Stories dataPromise={dataPromise} />;
}

export default function StoriesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <Suspense>
      <StoriesLoader searchParams={searchParams} />
    </Suspense>
  );
}
