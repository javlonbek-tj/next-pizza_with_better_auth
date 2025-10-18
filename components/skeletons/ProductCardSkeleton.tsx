export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image section - matches your flex justify-center bg-secondary p-6 rounded-lg h-[260px] */}
      <div className="flex justify-center bg-secondary p-6 rounded-lg h-[260px]">
        <div className="bg-gray-300 rounded w-[215px] h-[215px]"></div>
      </div>

      {/* Content section - matches your flex flex-col flex-1 mt-4 */}
      <div className="flex flex-col flex-1 mt-4">
        {/* Title skeleton - matches your Title component */}
        <div className="bg-gray-200 mb-2 rounded w-3/4 h-6"></div>

        {/* Ingredients description skeleton - matches your ingredients text */}
        <div className="space-y-1">
          <div className="bg-gray-200 rounded w-full h-4"></div>
          <div className="bg-gray-200 rounded w-4/5 h-4"></div>
        </div>

        {/* Price and button section - matches your flex justify-between items-center mt-auto pt-4 */}
        <div className="flex justify-between items-center mt-auto pt-4">
          {/* Price skeleton - matches your "от [price] ₽" */}
          <div className="flex items-center gap-1">
            <div className="bg-gray-200 rounded w-6 h-5"></div>
            <div className="bg-gray-200 rounded w-12 h-6"></div>
            <div className="bg-gray-200 rounded w-4 h-5"></div>
          </div>

          {/* Button skeleton - matches your Button component with Plus icon */}
          <div className="bg-gray-200 rounded w-28 h-10"></div>
        </div>
      </div>
    </div>
  );
}
