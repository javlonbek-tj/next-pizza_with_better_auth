'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib';
import { Container } from '../shared/Container';
import { SearchInput } from '../filters/Search-input';
import { CartButton } from '../cart';
import { ProfileButton } from '../profile/Profile-button';
import { AuthModal } from '../modals/auth-modal/auth-modal';
import { Session } from 'next-auth';

interface Props {
  className?: string;
  hasSearch?: boolean;
  hasCartBtn?: boolean;
  session?: Session | null;
}

export function Header({ className, hasSearch, hasCartBtn, session }: Props) {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  return (
    <header className={cn('border border-b', className)}>
      <Container className='flex justify-between items-center py-5'>
        <Link href={'/'}>
          <div className='flex items-center gap-4'>
            <Image src='/logo.png' alt='logo' width={35} height={35} />
            <div>
              <h1 className='font-black text-2xl uppercase'>Next Pizza</h1>
              <p className='text-gray-400 text-sm leading-3'>
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
