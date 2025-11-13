'use client';

import { useGetCategories } from '@/hooks';
import { cn } from '@/lib';
import { useCategoryStore } from '@/store/category';
import { CategoriesSkeleton } from '../skeletons';

interface Props {
  className?: string;
}

export function Categories({ className }: Props) {
  const activeCategoryName = useCategoryStore((state) => state.activeName);
  const setActiveCategoryName = useCategoryStore(
    (state) => state.setActiveName
  );

  const { data: categories = [], isPending } = useGetCategories();

  const handleClick = (categoryName: string) => {
    setActiveCategoryName(categoryName);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-gray-50 p-1 rounded-2xl',
        className
      )}
    >
      {isPending ? (
        <CategoriesSkeleton />
      ) : (
        categories.map((category) => (
          <a
            key={category.id}
            href={`/#${category.slug}`}
            onClick={() => handleClick(category.slug)}
            className={cn(
              'hover:bg-white px-5 py-2 rounded-xl font-medium hover:text-primary transition duration-300',
              activeCategoryName === category.slug && 'bg-white text-primary'
            )}
          >
            {category.name}
          </a>
        ))
      )}
    </div>
  );
}
