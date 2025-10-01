'use client';

import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './forms/login-form';
import { RegisterForm } from './forms/register-form';
import { Button } from '@/components/ui/button';
import { AuthSwitch } from './auth-switch';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Loader } from 'lucide-react';
import { VerifyModal } from '../Verify-modal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: Props) {
  const [type, setType] = useState<'login' | 'register'>('login');
  const [loadingProvider, setLoadingProvider] = useState<
    null | 'google' | 'github'
  >(null);

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationData, setVerificationData] = useState<{
    userId: string;
    email: string;
  } | null>(null);

  const onSwitchType = () => setType(type === 'login' ? 'register' : 'login');

  const handleClose = () => {
    if (loadingProvider) return;
    onClose();
  };

  const onClick = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    await signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
      redirect: true,
    });
  };

  const isLoading = !!loadingProvider;

  const handleNeedsVerification = (data: { userId: string; email: string }) => {
    setVerificationData(data);
    setShowVerifyModal(true);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className='bg-white p-7 w-[450px]'>
          <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
            <DialogTitle className='font-semibold text-xl text-center'>
              {type === 'login' ? 'Войти' : 'Регистрация'}
            </DialogTitle>

            {type === 'login' ? (
              <LoginForm
                onClose={onClose}
                onNeedsVerification={handleNeedsVerification}
              />
            ) : (
              <RegisterForm onNeedsVerification={handleNeedsVerification} />
            )}

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

            <AuthSwitch type={type} onSwitch={onSwitchType} className='mt-4' />
          </div>
        </DialogContent>
      </Dialog>

      <VerifyModal
        open={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        userId={verificationData?.userId || ''}
        email={verificationData?.email}
      />
    </>
  );
}
