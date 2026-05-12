export function ProductModalSkeleton() {
  return (
    <div className='flex h-full overflow-hidden'>
      {/* Left: image area */}
      <div className='flex w-72 shrink-0 items-center justify-center bg-gray-100 animate-pulse' />

      {/* Right: form area */}
      <div className='flex flex-1 flex-col bg-[#f7f6f5]'>
        {/* Scrollable content */}
        <div className='flex-1 space-y-4 overflow-hidden p-7'>
          {/* Title */}
          <div className='h-6 w-2/3 rounded bg-gray-200 animate-pulse' />
          {/* Description line */}
          <div className='h-4 w-1/3 rounded bg-gray-200 animate-pulse' />

          {/* Size variants */}
          <div className='mt-4 flex gap-2'>
            {[0, 1, 2].map((i) => (
              <div key={i} className='h-8 w-20 rounded-lg bg-gray-200 animate-pulse' />
            ))}
          </div>

          {/* Type variants */}
          <div className='flex gap-2'>
            {[0, 1].map((i) => (
              <div key={i} className='h-8 w-24 rounded-lg bg-gray-200 animate-pulse' />
            ))}
          </div>

          {/* Ingredients label */}
          <div className='mt-4 h-4 w-28 rounded bg-gray-200 animate-pulse' />

          {/* Ingredients grid */}
          <div className='grid grid-cols-3 gap-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='h-24 rounded-lg bg-gray-200 animate-pulse' />
            ))}
          </div>
        </div>

        {/* Fixed bottom button */}
        <div className='px-7 py-4 bg-[#f7f6f5]'>
          <div className='h-11 w-full rounded-lg bg-gray-200 animate-pulse' />
        </div>
      </div>
    </div>
  );
}
