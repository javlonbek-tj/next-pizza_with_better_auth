// components/admin/IngredientCarousel.tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Ingredient } from '@/lib/generated/prisma';
interface IngredientCarouselProps {
  ingredients: Ingredient[];
}

export function IngredientCarousel({ ingredients }: IngredientCarouselProps) {
  return (
    <Carousel className='w-full' opts={{ align: 'start', loop: false }}>
      <CarouselContent className='-ml-2'>
        {ingredients.map((ingredient) => (
          <CarouselItem
            key={ingredient.id}
            className='pl-2 basis-auto min-w-[100px]'
          >
            <div className='flex flex-col items-center space-y-1.5 p-2 bg-white rounded-lg border'>
              {ingredient.imageUrl ? (
                <div className='relative w-12 h-12 overflow-hidden bg-gray-100 rounded-full'>
                  <Image
                    src={ingredient.imageUrl}
                    alt={ingredient.name}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='w-12 h-12 bg-gray-200 border-2 border-gray-300 border-dashed rounded-full' />
              )}
              <Badge variant='outline' className='h-6 text-xs'>
                {ingredient.name}
              </Badge>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {ingredients.length > 4 && (
        <div className='flex justify-center mt-8 space-x-4'>
          <CarouselPrevious className='static cursor-pointer transform-none' />
          <CarouselNext className='static cursor-pointer transform-none' />
        </div>
      )}
    </Carousel>
  );
}
