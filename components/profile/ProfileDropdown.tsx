'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, Loader2, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { signoutAction } from '@/app/actions/auth/signout-action';
import { cn } from '@/lib/utils';

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function ProfileDropdown({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitial = () => {
    const nameOrEmail = user?.name || user?.email;
    return nameOrEmail ? nameOrEmail.charAt(0).toUpperCase() : 'U';
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    const result = await signoutAction();

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Вы вышли из аккаунта');
      setOpen(false);
      const queryString = window.location.search;
      router.push(`/${queryString}`, { scroll: false });
    }

    setIsLoggingOut(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className='flex justify-center items-center gap-2 bg-primary/80 p-0 rounded-full focus-visible:ring-0 w-10 h-10 font-semibold text-lg cursor-pointer'>
          {getInitial()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className={cn(
          'w-48 transition-opacity duration-200',
          isLoggingOut && 'opacity-60 pointer-events-none'
        )}
      >
        <DropdownMenuLabel>
          {user?.name ?? user?.email ?? 'Unknown'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={() => router.push('/admin')}
        >
          <Shield className='w-4 h-4' /> Admin
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLoggingOut}>
          <User className='w-4 h-4' /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLoggingOut}>
          <Settings className='w-4 h-4' /> Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          className='text-destructive cursor-pointer'
          onSelect={(e) => {
            e.preventDefault(); // prevent auto-close
            handleSignOut();
          }}
        >
          <>
            {isLoggingOut ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <LogOut className='w-4 h-4' />
            )}
            <span className='ml-2'>Выйти</span>
          </>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
