'use client';

export function CategoriesSkeleton() {
  return (
    <div className='flex items-center gap-1 p-1 bg-gray-50 rounded-2xl'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='w-20 h-8 bg-gray-200 rounded-xl animate-pulse'
        />
      ))}
    </div>
  );
}
