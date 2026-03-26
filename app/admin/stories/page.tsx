import { Stories } from '@/components/admin';
import { getStoriesTableData } from '@/server/data/stories';

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}) {
  const { page = '1', limit = '10' } = await searchParams;

  const dataPromise = getStoriesTableData(Number(page), Number(limit));

  return <Stories dataPromise={dataPromise} />;
}
