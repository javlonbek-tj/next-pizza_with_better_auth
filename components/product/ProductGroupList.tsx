'use client';

import { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';

import { cn } from '@/lib';
import { Title } from '../shared';
import { ProductCard } from './ProductCard';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useCategoryStore } from '@/store/category';

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
    (state) => state.setActiveName
  );
  const intersectionRef = useRef<HTMLDivElement>(null);
  const intersection = useIntersection(
    intersectionRef as React.RefObject<HTMLElement>,
    { threshold: 0.5, rootMargin: '-100px 0px -60% 0px' }
  );

  useEffect(() => {
    if (intersection?.isIntersecting) {
      setActiveCategoryName(categoryTitle);
    }
  }, [intersection, categoryTitle, setActiveCategoryName]);

  return (
    <div className={cn('scroll-mt-20', className)} id={categorySlug}>
      <div ref={intersectionRef}>
        <Title text={categoryTitle} size="lg" className="mb-5 font-extrabold" />
      </div>

      <div className={cn('gap-8 grid grid-cols-3', listClassName)}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
