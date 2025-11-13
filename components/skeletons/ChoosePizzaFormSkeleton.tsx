'use client';
import { cn } from '@/lib';
import { GroupVariantsSkeleton } from './GroupVariantsSkeleton';

interface Props {
  className?: string;
  isModal: boolean;
}

export function ChoosePizzaFormSkeleton({ className, isModal }: Props) {
  return (
    <div
      className={cn(
        'flex h-full', // same as ChoosePizzaForm
        !isModal && 'max-w-5xl mx-auto',
        className
      )}
    >
      {/* ───── LEFT – IMAGE ───── */}
      <div
        className={cn(
          'flex-1 relative overflow-hidden',
          !isModal && 'rounded-2xl bg-[#FFF7EE]' // non‑modal style
        )}
      >
        {/* full‑height gradient placeholder */}
        <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse' />
      </div>

      {/* ───── RIGHT – FORM ───── */}
      <div
        className={cn(
          'flex-1 flex flex-col',
          isModal ? 'bg-[#f7f6f5]' : 'bg-white'
        )}
      >
        {/* SCROLLABLE CONTENT */}
        <div className='flex-1 overflow-y-auto p-7 scrollbar-thin scrollbar-thumb-gray-300'>
          {/* Title */}
          <div className='w-3/4 h-8 mb-2 bg-gray-300 rounded-lg animate-pulse' />
          {/* Description (size + type) */}
          <div className='w-1/2 h-4 mb-4 bg-gray-200 rounded animate-pulse' />

          {/* Pizza sizes */}
          <GroupVariantsSkeleton itemCount={3} className='mt-4' />
          {/* Pizza types */}
          <GroupVariantsSkeleton itemCount={2} className='mt-3' />

          {/* Ingredients title */}
          <div className='w-32 h-6 mt-4 mb-2 bg-gray-300 rounded animate-pulse' />

          {/* Ingredients grid – dynamic count */}
          <div className='grid grid-cols-3 gap-2 mt-2'>
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border border-gray-200 p-3',
                  !isModal && 'bg-[#f7f6f5]' // non‑modal card bg
                )}
              >
                <div className='w-16 h-16 mb-2 bg-gray-300 rounded-full animate-pulse' />
                <div className='w-full h-3 mb-1 bg-gray-200 rounded animate-pulse' />
                <div className='w-12 h-3 bg-gray-200 rounded animate-pulse' />
              </div>
            ))}
          </div>
        </div>

        {/* FIXED BUTTON */}
        <div className={cn('p-7 pt-0', isModal ? 'bg-[#f7f6f5]' : 'bg-white')}>
          <div className='w-full h-12 bg-gray-300 rounded-lg animate-pulse' />
        </div>
      </div>
    </div>
  );
}
