import { Skeleton } from '@/components/ui/skeleton';

export function FilterSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Тип теста Section */}
      <div className='space-y-3'>
        <Skeleton className='w-24 h-5' /> {/* Title: "Тип теста:" */}
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' /> {/* Checkbox */}
            <Skeleton className='w-20 h-4' /> {/* Label: "Тонкое" */}
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-32 h-4' /> {/* Label: "Традиционное" */}
          </div>
        </div>
      </div>

      {/* Размеры Section */}
      <div className='space-y-3'>
        <Skeleton className='w-24 h-5' /> {/* Title: "Размеры:" */}
        <div className='space-y-3'>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-16 h-4' /> {/* Label: "30 см" */}
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-16 h-4' /> {/* Label: "35 см" */}
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='w-6 h-6 rounded' />
            <Skeleton className='w-16 h-4' /> {/* Label: "40 см" */}
          </div>
        </div>
      </div>

      {/* Цены от и до Section */}
      <div className='space-y-3'>
        <Skeleton className='h-5 w-28' /> {/* Title: "Цены от и до:" */}
        <div className='flex gap-3'>
          <Skeleton className='flex-1 h-11' /> {/* From input */}
          <Skeleton className='flex-1 h-11' /> {/* To input */}
        </div>
        {/* Range Slider */}
        <div className='pt-2 space-y-2'>
          <Skeleton className='w-full h-1 rounded-full' /> {/* Slider track */}
          <div className='flex justify-between'>
            <Skeleton className='w-8 h-3' /> {/* Min value */}
            <Skeleton className='w-12 h-3' /> {/* Max value */}
          </div>
        </div>
      </div>

      {/* Ингредиенты Section */}
      <div className='space-y-3'>
        <Skeleton className='w-32 h-5' /> {/* Title: "Ингредиенты:" */}
        <div className='space-y-3'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='flex items-center gap-3'>
              <Skeleton className='w-6 h-6 rounded' />
              <Skeleton className='h-4 w-28' /> {/* Ingredient name */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
