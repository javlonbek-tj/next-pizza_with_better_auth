'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { CheckoutCard } from './CheckoutCard';
import { FormField } from '../form/FormField';
import { authClient } from '@/lib/auth/auth-client';
import { AuthModal } from '../modals/AuthModal';
import { Button } from '@/components/ui/button';
import { CheckoutPersonalInfoSkeleton } from '../skeletons/CheckoutPersonalInfoSkeleton';
import { cn } from '@/lib';

export function CheckoutPersonalInfo() {
  const [authOpen, setAuthOpen] = useState(false);
  const { data: session, isPending, refetch } = authClient.useSession();
  const { setValue } = useFormContext();

  const isAuthenticated = !!session?.user;
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || '';

  // Auto-fill form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userEmail) {
        setValue('email', userEmail, { shouldValidate: true });
      }
      if (userName) {
        setValue('firstName', userName, { shouldValidate: true });
      }
    }
  }, [isAuthenticated, userEmail, userName, setValue]);

  // Sync session when login happens from outside (e.g. Header)
  useEffect(() => {
    const handleAuthSuccess = () => {
      refetch();
    };

    window.addEventListener('auth-success', handleAuthSuccess);
    return () => window.removeEventListener('auth-success', handleAuthSuccess);
  }, [refetch]);

  const handleAuthModalClose = async () => {
    setAuthOpen(false);
    try {
      await refetch();
    } catch {
      // ignore
    }
  };

  // Show skeleton while checking authentication
  if (isPending) {
    return <CheckoutPersonalInfoSkeleton />;
  }

  return (
    <>
      <CheckoutCard title='2. Персональные данные'>
        <div className='grid grid-cols-2 gap-5'>
          <FormField label='Имя' name='firstName' placeholder='Имя' required />
          <FormField
            label='Фамилия'
            name='lastName'
            placeholder='Фамилия'
            required
          />
          <FormField
            label='Электронная почта'
            name='email'
            placeholder='user@gmail.com'
            hasClearBtn={false}
            required
            className={cn(
              !isAuthenticated &&
                'pointer-events-none opacity-80 cursor-not-allowed',
            )}
            disabled={isAuthenticated}
            suffix={
              !isAuthenticated ? (
                <Button
                  variant='link'
                  size='sm'
                  type='button'
                  className='h-6 px-2 cursor-pointer text-primary hover:underline'
                  onClick={() => setAuthOpen(true)}
                >
                  Войти
                </Button>
              ) : (
                <span className='text-xs font-medium text-green-600'>
                  ✓ Авторизован
                </span>
              )
            }
          />
          <FormField label='Телефон' name='phone' isPhone required />
        </div>
      </CheckoutCard>

      <AuthModal open={authOpen} onClose={handleAuthModalClose} />
    </>
  );
}
