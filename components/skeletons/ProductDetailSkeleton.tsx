export function ProductDetailSkeleton() {
  return (
    <div className='p-6 space-y-6'>
      {/* Header card */}
      <div className='flex items-center gap-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm'>
        <div className='w-24 h-24 rounded-xl bg-gray-200 animate-pulse shrink-0' />
        <div className='space-y-2'>
          <div className='h-5 w-48 bg-gray-200 rounded animate-pulse' />
          <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
          <div className='h-3 w-32 bg-gray-200 rounded animate-pulse' />
        </div>
      </div>

      {/* Two cards */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {[0, 1].map((i) => (
          <div
            key={i}
            className='h-48 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse'
          />
        ))}
      </div>

      {/* Stats row */}
      <div className='grid grid-cols-3 gap-4'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='h-20 bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse'
          />
        ))}
      </div>
    </div>
  );
}
