'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { CheckoutCard } from './checkout-card';
import { FormField } from '../form/form-field';
import { authClient } from '@/lib/auth-client';
import { AuthModal } from '../modals/auth-modal';
import { Button } from '@/components/ui/button';

export function CheckoutPersonalInfo() {
  const [authOpen, setAuthOpen] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const { data: session, isPending, refetch } = authClient.useSession();
  const { setValue } = useFormContext();
  const router = useRouter();
  const isAuthenticated = !!session?.user;
  const userEmail = session?.user?.email || '';

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      setValue('email', userEmail, { shouldValidate: true });
    }
  }, [isAuthenticated, userEmail, setValue]);

  const handleAuthModalClose = async () => {
    setAuthOpen(false);
    setIsRefetching(true);
    try {
      await refetch(); // Update client-side session
      router.refresh(); // Refresh server components
    } catch (error) {
      console.error('Session refetch failed:', error);
    } finally {
      setIsRefetching(false);
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CheckoutCard title='2. Персональные данные'>
        <div className='gap-5 grid grid-cols-2'>
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
            disabled={isAuthenticated || isRefetching}
            suffix={
              !isAuthenticated ? (
                <Button
                  variant='link'
                  size='sm'
                  className='text-blue-600 h-6 px-2'
                  onClick={() => setAuthOpen(true)}
                  disabled={isRefetching}
                >
                  {isRefetching ? 'Loading...' : 'Войти'}
                </Button>
              ) : null
            }
          />
          <FormField
            label='Телефон'
            name='phone'
            placeholder='Телефон'
            isPhone
            required
          />
        </div>
      </CheckoutCard>
      <AuthModal
        open={authOpen}
        onClose={handleAuthModalClose}
        callbackUrl='/checkout'
      />
    </>
  );
}
