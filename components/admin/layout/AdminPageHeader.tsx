'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { signOut, useSession } from '@/lib/auth/auth-client';
import { useQueryClient } from '@tanstack/react-query';

export function AdminPageHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <header className='flex items-center justify-between px-6 py-4 bg-white border-b h-[69px]'>
        <div className='flex items-center gap-2'>
          <div className='w-5 h-5 bg-gray-200 rounded-full animate-pulse' />
          <div className='space-y-1'>
            <div className='w-24 h-3 bg-gray-200 rounded animate-pulse' />
            <div className='w-32 h-3 bg-gray-200 rounded animate-pulse' />
          </div>
        </div>
        <div className='w-24 h-8 bg-gray-200 rounded animate-pulse' />
      </header>
    );
  }

  if (!session?.user) return null;

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.setQueryData(['cart'], []);
          toast.success('Вы вышли из аккаунта');
          const queryString = window.location.search;
          router.push(`/${queryString}`, { scroll: false });
        },
        onError: () => {
          toast.error('Что-то пошло не так');
        },
        onFinally: () => {
          setIsLoggingOut(false);
        },
      },
    });
  };

  return (
    <header className='flex items-center justify-between px-6 py-4 bg-white border-b'>
      <div className='flex items-center gap-2'>
        <User className='w-5 h-5 text-gray-600' />
        <div>
          <p className='text-sm font-medium'>{session.user.name}</p>
          <p className='text-xs text-gray-500'>{session.user.email}</p>
        </div>
      </div>
      <Button
        variant='outline'
        size='sm'
        onClick={handleSignOut}
        disabled={isLoggingOut}
        className='cursor-pointer w-25'
      >
        {isLoggingOut ? (
          <Loader className='w-5 h-5 animate-spin' />
        ) : (
          <LogOut className='w-4 h-4' />
        )}
        Выйти
      </Button>
    </header>
  );
}
