'use client';

export function CategoriesSkeleton() {
  return (
    <div className='bg-gray-50 flex items-center gap-1 p-1 rounded-2xl'>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className='h-9 w-20 rounded-xl bg-gray-200 animate-pulse'
        />
      ))}
    </div>
  );
}
