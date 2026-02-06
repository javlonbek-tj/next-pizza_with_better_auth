'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib';
import { Container } from '../shared/';
import { SearchInput } from '../filters/SearchInput';
import { CartButton } from '../cart';
import { ProfileButton } from '../profile/ProfileButton';
import { AuthModal } from '../modals/AuthModal';
import type { Session } from '@/server/auth';

interface Props {
  className?: string;
  hasSearch?: boolean;
  hasCartBtn?: boolean;
  session: Session | null;
}

export function Header({
  className,
  hasSearch = true,
  hasCartBtn = true,
  session,
}: Props) {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  return (
    <header className={cn('border border-b', className)}>
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

          <ProfileButton
            onClickSignIn={() => setOpenAuthModal(true)}
            session={session}
          />
        </div>
      </Container>
    </header>
  );
}
