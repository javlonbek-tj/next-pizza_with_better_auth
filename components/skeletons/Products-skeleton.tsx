import { ProductCardSkeleton } from './Product-card-skeleton';

export function ProductsSkeleton() {
  return (
    <div className='scroll-mt-20'>
      <div className='h-8 bg-gray-200 rounded w-48 mb-5 animate-pulse'></div>
      <div className='gap-8 grid grid-cols-3'>
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
