import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductDetailContent } from '@/components/admin';
import { ProductDetailSkeleton } from '@/components/skeletons';

interface Props {
  params: Promise<{ id: string }>;
}

async function ProductDetailWrapper({ params }: Props) {
  const { id } = await params;
  return <ProductDetailContent id={id} />;
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <div className='p-6 space-y-6'>
      <Link
        href='/admin/products'
        className='inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-800'
      >
        <ArrowLeft className='w-4 h-4' />
        Назад к продуктам
      </Link>

      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailWrapper params={params} />
      </Suspense>
    </div>
  );
}
