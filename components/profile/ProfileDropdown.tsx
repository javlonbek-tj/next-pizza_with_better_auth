'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Loader2, Shield, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { USER_ROLES } from '@/lib/constants';
import { signOut } from '@/lib/auth/auth-client';

interface Props {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export function ProfileDropdown({ user }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();

  const getInitial = () => {
    const nameOrEmail = user?.name || user?.email;
    return nameOrEmail ? nameOrEmail.charAt(0).toUpperCase() : 'U';
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.setQueryData(['cart'], []);
          toast.success('Вы вышли из аккаунта');
          setOpen(false);
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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          id='profile-dropdown-trigger'
          suppressHydrationWarning
          className='flex items-center justify-center w-10 h-10 gap-2 p-0 text-lg font-semibold rounded-full cursor-pointer bg-primary/80 focus-visible:ring-0'
        >
          {getInitial()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className={cn(
          'w-48 transition-opacity duration-200',
          isLoggingOut && 'opacity-60 pointer-events-none',
        )}
      >
        <DropdownMenuLabel>
          {user?.name ?? user?.email ?? 'User'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user.role === USER_ROLES.ADMIN && (
          <DropdownMenuItem disabled={isLoggingOut} asChild>
            <Link href='/admin/products' className='cursor-pointer'>
              <Shield className='w-4 h-4' /> Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled={isLoggingOut} asChild>
          <Link href='/profile' className='cursor-pointer'>
            <User className='w-4 h-4' /> Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLoggingOut} asChild>
          <Link href='/orders' className='cursor-pointer'>
            <ShoppingBag className='w-4 h-4' /> Мои заказы
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='cursor-pointer text-destructive'
          onSelect={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
          disabled={isLoggingOut}
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
