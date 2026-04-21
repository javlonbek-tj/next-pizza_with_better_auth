'use client';

import { cn } from '@/lib';
import { useCategoryStore } from '@/store/category';
import { CategoryListItem } from '@/types';

interface Props {
  className?: string;
  categories: CategoryListItem[];
}

export function Categories({ className, categories }: Props) {
  const activeCategoryName = useCategoryStore((state) => state.activeName);
  const setActiveCategoryName = useCategoryStore(
    (state) => state.setActiveName
  );

  const handleClick = (categoryName: string) => {
    setActiveCategoryName(categoryName);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-gray-100 p-1 rounded-md font-medium text-base',
        className
      )}
    >
      {categories.map((category) => (
        <a
          key={category.id}
          href={`/#${category.slug}`}
          onClick={() => handleClick(category.slug)}
          className={cn(
            'hover:bg-white px-4 py-1 rounded-md font-medium hover:text-primary text-sm transition duration-300',
            activeCategoryName === category.slug && 'bg-white text-primary'
          )}
        >
          {category.name}
        </a>
      ))}
    </div>
  );
}
