'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { RegisterForm, LoginForm, AuthSwitch } from '../auth';
import { useAuthModal } from '@/hooks/use-auth-modal';
import { SocialButtons } from '../auth';

interface Props {
  open: boolean;
  onClose: () => void;
  callbackUrl?: string;
}

export function AuthModal({ open, onClose, callbackUrl }: Props) {
  const {
    type,
    onSwitchType,
    loadingProvider,
    showingOTP,
    setShowingOTP,
    setFormPending,
    isLoading,
    handleAuthSocial,
    resetModalState,
  } = useAuthModal();

  useEffect(() => {
    if (!open) {
      resetModalState();
    }
  }, [open, resetModalState]);

  const handleClose = () => {
    if (loadingProvider) return;
    onClose();
    setShowingOTP(false);
  };
  const handleLoginSuccess = () => {
    onClose();
    if (callbackUrl) {
      redirect(callbackUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white p-7 w-[450px]">
        <div className={isLoading ? 'opacity-70 pointer-events-none' : ''}>
          <DialogTitle className="font-semibold text-xl text-center">
            {showingOTP
              ? 'Подтверждение почты'
              : type === 'login'
              ? 'Войти'
              : 'Регистрация'}
          </DialogTitle>

          {type === 'login' ? (
            <LoginForm
              onClose={handleLoginSuccess}
              onShowOTP={setShowingOTP}
              onPendingChange={setFormPending}
            />
          ) : (
            <RegisterForm
              onClose={handleLoginSuccess}
              onShowOTP={setShowingOTP}
              onPendingChange={setFormPending}
            />
          )}

          {!showingOTP && (
            <>
              <hr className="my-3" />
              <SocialButtons
                loadingProvider={loadingProvider}
                isLoading={isLoading}
                onClick={handleAuthSocial}
              />
              <AuthSwitch
                type={type}
                onSwitch={onSwitchType}
                className="mt-4"
              />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
