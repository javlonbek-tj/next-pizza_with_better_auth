'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { CheckoutCard } from './checkout-card';
import { FormField } from '../form/form-field';
import { authClient } from '@/lib/auth-client';
import { AuthModal } from '../modals/auth-modal';
import { Button } from '@/components/ui/button';
import { CheckoutPersonalInfoSkeleton } from '../skeletons/checkout-personal-info-skeleton';
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

  const handleAuthModalClose = async () => {
    setAuthOpen(false);
    try {
      await refetch();
    } catch (error) {
      console.error('Session refetch failed:', error);
    }
  };

  // Show skeleton while checking authentication
  if (isPending) {
    return <CheckoutPersonalInfoSkeleton />;
  }

  return (
    <>
      <CheckoutCard title="2. Персональные данные">
        <div className="gap-5 grid grid-cols-2">
          <FormField label="Имя" name="firstName" placeholder="Имя" required />
          <FormField
            label="Фамилия"
            name="lastName"
            placeholder="Фамилия"
            required
          />
          <FormField
            label="Электронная почта"
            name="email"
            placeholder="user@gmail.com"
            hasClearBtn={false}
            required
            className={cn(
              !isAuthenticated &&
                'pointer-events-none opacity-80 cursor-not-allowed'
            )}
            disabled={isAuthenticated}
            suffix={
              !isAuthenticated ? (
                <Button
                  variant="link"
                  size="sm"
                  type="button"
                  className="px-2 h-6 text-primary hover:underline cursor-pointer"
                  onClick={() => setAuthOpen(true)}
                >
                  Войти
                </Button>
              ) : (
                <span className="font-medium text-green-600 text-xs">
                  ✓ Авторизован
                </span>
              )
            }
          />
          <FormField label="Телефон" name="phone" isPhone required />
        </div>
      </CheckoutCard>

      <AuthModal open={authOpen} onClose={handleAuthModalClose} />
    </>
  );
}
