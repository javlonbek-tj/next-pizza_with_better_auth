'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { Loader } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RegisterForm, LoginForm, AuthSwitch } from '../auth';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: Props) {
  const [type, setType] = useState<'login' | 'register'>('login');
  const [loadingProvider, setLoadingProvider] = useState<
    null | 'google' | 'github'
  >(null);
  const [showingOTP, setShowingOTP] = useState(false);

  const onSwitchType = () => setType(type === 'login' ? 'register' : 'login');

  const handleClose = () => {
    if (loadingProvider) return;
    onClose();
    // Reset state when closing
    setShowingOTP(false);
  };

  const onClick = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    await signIn(provider, {
      callbackUrl: '/',
      redirect: true,
    });
  };

  const isLoading = !!loadingProvider;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className='bg-white p-7 w-[450px]'>
          <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
            <DialogTitle className='font-semibold text-xl text-center'>
              {showingOTP
                ? 'Подтверждение почты'
                : type === 'login'
                ? 'Войти'
                : 'Регистрация'}
            </DialogTitle>

            {type === 'login' ? (
              <LoginForm onClose={onClose} onShowOTP={setShowingOTP} />
            ) : (
              <RegisterForm onClose={onClose} onShowOTP={setShowingOTP} />
            )}

            {/* Only show social buttons and auth switch when NOT showing OTP */}
            {!showingOTP && (
              <>
                <hr className='my-3' />

                <div className='flex gap-2'>
                  <Button
                    variant='secondary'
                    onClick={() => onClick('google')}
                    type='button'
                    disabled={isLoading}
                    className='flex-1 gap-2 p-2 h-10 text-amber-950 cursor-pointer'
                  >
                    {loadingProvider === 'google' ? (
                      <Loader className='w-5 h-5 animate-spin' />
                    ) : (
                      <FcGoogle className='w-6 h-6' />
                    )}
                    Google
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={() => onClick('github')}
                    type='button'
                    disabled={isLoading}
                    className='flex-1 gap-2 p-2 h-10 text-amber-950 cursor-pointer'
                  >
                    {loadingProvider === 'github' ? (
                      <Loader className='w-5 h-5 animate-spin' />
                    ) : (
                      <FaGithub className='w-6 h-6' />
                    )}
                    GitHub
                  </Button>
                </div>

                <AuthSwitch
                  type={type}
                  onSwitch={onSwitchType}
                  className='mt-4'
                />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
