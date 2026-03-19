'use client';

import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/lib';
import { Api } from '@/services/api-client';
import type { Product } from '@/lib/generated/prisma/client';

interface Props {
  className?: string;
}

export function SearchInput({ className }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  useClickAway(ref, () => {
    setFocused(false);
  });

  const { data: searchedProducts = [] } = useQuery<Product[], Error>({
    queryKey: ['products', debouncedQuery],
    queryFn: () => Api.products.search(debouncedQuery),
    enabled: debouncedQuery.trim().length > 2,
    staleTime: 30 * 1000,
  });

  return (
    <>
      {focused && <div className='fixed inset-0 z-40 bg-black/50' />}
      <div
        ref={ref}
        className={cn(
          'z-40 relative flex flex-1 items-center bg-gray-100 mx-10 px-5 py-2.5 rounded-2xl transition duration-300',
          className,
        )}
      >
        <Search className='h-5 text-gray-400' />
        <input
          type='text'
          className='w-full pl-5 outline-none'
          placeholder='Найти пиццу...'
          onFocus={() => setFocused(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {searchedProducts && searchedProducts.length > 0 && (
          <div
            className={cn(
              'top-14 right-0 left-0 z-100 absolute bg-white shadow-md rounded-xl max-h-96 overflow-y-auto origin-top transition-all duration-200',
              focused
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95 pointer-events-none',
            )}
          >
            {searchedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                scroll={false}
                className='flex items-center w-full gap-3 px-3 py-2 transition duration-200 hover:bg-orange-50'
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  className='w-8 h-8 rounded-full'
                  width={32}
                  height={32}
                />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
