'use client';

import { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import { useSearchParams } from 'next/navigation';

import { cn } from '@/lib';
import { Title } from '../shared';
import { ProductCard } from './ProductCard';
import { useCategoryStore } from '@/store/category';
import { ProductWithRelations } from '@/types';

interface Props {
  className?: string;
  categoryTitle: string;
  categorySlug: string;
  listClassName?: string;
  products: ProductWithRelations[];
}

export function ProductGroupList({
  className,
  categoryTitle,
  categorySlug,
  listClassName,
  products,
}: Props) {
  const setActiveCategoryName = useCategoryStore(
    (state) => state.setActiveName,
  );
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(
    intersectionRef as React.RefObject<HTMLElement>,
    {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      rootMargin: '-80px 0px -90% 0px',
    },
  );

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryName(categorySlug);
    }
  }, [intersection, categorySlug, setActiveCategoryName]);

  return (
    <div
      className={cn('scroll-mt-20', className)}
      id={categorySlug}
      ref={intersectionRef}
    >
      <Title text={categoryTitle} className='mb-4 font-extrabold' size='md' />

      <div className={cn('gap-8 grid grid-cols-3', listClassName)}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            queryString={queryString}
          />
        ))}
      </div>
    </div>
  );
}
