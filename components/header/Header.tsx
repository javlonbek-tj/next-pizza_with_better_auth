'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib';
import { Container } from '../shared/';
import { SearchInput } from '../filters/SearchInput';
import { CartButton } from '../cart';
import { ProfileButton } from '../profile/ProfileButton';
import { AuthModal } from '../modals/AuthModal';
import { useSession } from '@/lib/auth/auth-client';

interface Props {
  className?: string;
  hasSearch?: boolean;
  hasCartBtn?: boolean;
}

export function Header({
  className,
  hasSearch = true,
  hasCartBtn = true,
}: Props) {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const { data: session, isPending, refetch } = useSession();

  useEffect(() => {
    const handler = () => refetch();
    window.addEventListener('auth-success', handler);
    return () => window.removeEventListener('auth-success', handler);
  }, [refetch]);
  return (
    <header className={cn('border border-b h-20', className)}>
      <Container className='flex items-center justify-between py-5'>
        <Link href={'/'}>
          <div className='flex items-center gap-4'>
            <Image src='/logo.png' alt='logo' width={30} height={30} />
            <div>
              <h1 className='text-xl font-black uppercase'>Next Pizza</h1>
              <p className='text-sm leading-3 text-gray-400'>
                вкусней уже некуда
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && <SearchInput />}

        <div className='flex items-center gap-4'>
          {hasCartBtn && <CartButton />}
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />

          {isPending ? (
            <div className='w-10 h-10 bg-gray-200 rounded-full animate-pulse' />
          ) : (
            <ProfileButton
              onClickSignIn={() => setOpenAuthModal(true)}
              session={session}
            />
          )}
        </div>
      </Container>
    </header>
  );
}
