import { Skeleton } from '@/components/ui/skeleton';

export function FilterSkeleton() {
  return (
    <div>
      {/* ---------- Pizza Types ---------- */}
      <div className='mb-5'>
        <div className='pb-2'>
          <Skeleton className='w-24 h-5' />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-20 h-4' />
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-32 h-4' />
          </div>
        </div>
      </div>

      {/* ---------- Pizza Sizes ---------- */}
      <div className='mb-5'>
        <div className='pb-2'>
          <Skeleton className='w-24 h-5' />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-16 h-4' />
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-16 h-4' />
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-16 h-4' />
          </div>
        </div>
      </div>

      {/* ---------- Price Range ---------- */}
      <div className='pt-4 mb-6 border-t border-b border-gray-200 pb-7'>
        <Skeleton className='h-5 mb-3 w-28' />
        <div className='flex gap-3 mb-3'>
          <Skeleton className='flex-1 h-11' />
          <Skeleton className='flex-1 h-11' />
        </div>
        {/* Range Slider */}
        <div className='space-y-3'>
          <Skeleton className='w-full h-1 rounded-full' />
          <div className='flex justify-between'>
            <Skeleton className='w-8 h-3' />
            <Skeleton className='w-12 h-3' />
          </div>
        </div>
      </div>

      {/* ---------- Ingredients ---------- */}
      <div className='mb-5'>
        <div className='pb-2'>
          <Skeleton className='w-32 h-5' />
        </div>
        <div className='flex flex-col gap-2'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='w-6 h-6 rounded' />
              <Skeleton className='h-4 w-28' />
            </div>
          ))}
        </div>
        {/* Show all button skeleton */}
        <Skeleton className='w-32 h-4 mt-2' />
      </div>
    </div>
  );
}
