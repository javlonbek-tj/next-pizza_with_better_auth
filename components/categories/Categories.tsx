'use client';

import { Category } from '@/generated/prisma/client';
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
        'bg-gray-50 flex items-center gap-1 p-1 rounded-2xl',
        className
      )}
    >
      {categories.map((category) => (
        <a
          key={category.name}
          href={`/#${category.name}`}
          className={cn(
            'hover:bg-white px-5 py-2 rounded-xl hover:text-primary transition duration-300 font-medium',
            categoryActiveId === category.id && 'bg-white text-primary'
          )}
        >
          {category.name}
        </a>
      ))}
    </div>
  );
}
