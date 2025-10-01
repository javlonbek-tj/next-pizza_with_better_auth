'use client';

import { Category } from '@/lib/generated/prisma/client';
import { cn } from '@/lib';
import { useCategoryStore } from '@/store/category';

interface Props {
  className?: string;
  categories: Category[];
}

export function Categories({ className, categories }: Props) {
  const categoryActiveId = useCategoryStore((state) => state.activeId);
  return (
    <div
      className={cn(
        'flex items-center gap-1 bg-gray-50 p-1 rounded-2xl',
        className
      )}
    >
      {categories.map((category) => (
        <a
          key={category.name}
          href={`/#${category.name}`}
          className={cn(
            'hover:bg-white px-5 py-2 rounded-xl font-medium hover:text-primary transition duration-300',
            categoryActiveId === category.id && 'bg-white text-primary'
          )}
        >
          {category.name}
        </a>
      ))}
    </div>
  );
}
