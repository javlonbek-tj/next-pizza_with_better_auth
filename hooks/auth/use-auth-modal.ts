import { useState } from 'react';
import toast from 'react-hot-toast';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signInSocialAction } from '@/app/actions';

export function useAuthModal() {
  const [type, setType] = useState<'login' | 'register'>('login');
  const [loadingProvider, setLoadingProvider] = useState<
    null | 'google' | 'github'
  >(null);
  const [showingOTP, setShowingOTP] = useState(false);
  const [formPending, setFormPending] = useState(false);

  const onSwitchType = () => setType(type === 'login' ? 'register' : 'login');

  const handleAuthSocial = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    try {
      await signInSocialAction(provider);
      setLoadingProvider(null);
    } catch (error) {
      if (isRedirectError(error)) throw error;
      toast.error('Что-то пошло не так, попробуйте еще раз');
      setLoadingProvider(null);
    }
  };

  const resetModalState = () => {
    setType('login');
    setShowingOTP(false);
    setFormPending(false);
    setLoadingProvider(null);
  };

  const isLoading = !!loadingProvider || formPending;
  return {
    type,
    onSwitchType,
    loadingProvider,
    showingOTP,
    formPending,
    isLoading,
    setShowingOTP,
    setFormPending,
    handleAuthSocial,
    resetModalState,
  };
}
