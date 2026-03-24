'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signoutAction } from '@/app/actions';
import toast from 'react-hot-toast';
import type { Session } from '@/lib/auth';

interface Props {
  session: Session | null;
}

export function AdminPageHeader({ session }: Props) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!session?.user) return null;

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const result = await signoutAction();

    if (result.error) {
      toast.error(result.message || 'Ошибка при выходе');
      setIsLoggingOut(false);
    } else {
      toast.success('Вы вышли из аккаунта');
      router.push('/');
      setIsLoggingOut(false);
    }
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
