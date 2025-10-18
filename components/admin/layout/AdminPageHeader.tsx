'use client';

import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Session } from '@/components/header/Header';

interface Props {
  session: Session | null;
}

export function AdminPageHeader({ session }: Props) {
  if (!session?.user) return null;

  return (
    <header className='bg-white border-b px-6 py-4 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <User className='w-5 h-5 text-gray-600' />
        <div>
          <p className='text-sm font-medium'>{session.user.name}</p>
          <p className='text-xs text-gray-500'>{session.user.email}</p>
        </div>
      </div>
      <Button variant='outline' size='sm'>
        <LogOut className='w-4 h-4 mr-2' />
        Logout
      </Button>
    </header>
  );
}
