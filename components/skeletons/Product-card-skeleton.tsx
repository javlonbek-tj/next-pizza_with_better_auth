export function ProductCardSkeleton() {
  return (
    <div className='animate-pulse'>
      {/* Image container - matches your bg-secondary p-6 rounded-lg h-[260px] */}
      <div className='flex justify-center bg-secondary p-6 rounded-lg h-[260px]'>
        <div className='w-[215px] h-[215px] bg-gray-300 rounded'></div>
      </div>

      {/* Content section - matches your flex flex-col flex-1 mt-4 */}
      <div className='flex flex-col flex-1 mt-4'>
        {/* Title skeleton - matches your Title component */}
        <div className='h-6 bg-gray-200 rounded mb-2 w-3/4'></div>

        {/* Ingredients description skeleton - matches your ingredients text */}
        <div className='space-y-1'>
          <div className='h-4 bg-gray-200 rounded w-full'></div>
          <div className='h-4 bg-gray-200 rounded w-4/5'></div>
        </div>

        {/* Price and button section - matches your flex justify-between items-center mt-auto pt-4 */}
        <div className='flex justify-between items-center mt-auto pt-4'>
          {/* Price skeleton - matches your "от [price] ₽" */}
          <div className='flex items-center gap-1'>
            <div className='h-5 bg-gray-200 rounded w-6'></div>
            <div className='h-6 bg-gray-200 rounded w-12'></div>
            <div className='h-5 bg-gray-200 rounded w-4'></div>
          </div>

          {/* Button skeleton - matches your Button component with Plus icon */}
          <div className='h-10 bg-gray-200 rounded w-28'></div>
        </div>
      </div>
    </div>
  );
}
