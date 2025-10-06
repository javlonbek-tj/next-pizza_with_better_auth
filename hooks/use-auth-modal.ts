import { useState } from 'react';
import { signInSocialAction } from '@/app/actions';

export function useAuthModal() {
  const [type, setType] = useState<'login' | 'register'>('login');
  const [loadingProvider, setLoadingProvider] = useState<
    null | 'google' | 'github'
  >(null);
  const [showingOTP, setShowingOTP] = useState(false);
  const [formPending, setFormPending] = useState(false);

  const onSwitchType = () => setType(type === 'login' ? 'register' : 'login');

  const isLoading = !!loadingProvider || formPending;
  const handleAuthSocial = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider);
    await signInSocialAction(provider);

    setLoadingProvider(null);
  };

  const resetModalState = () => {
    setType('login');
    setShowingOTP(false);
    setFormPending(false);
    setLoadingProvider(null);
  };

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
