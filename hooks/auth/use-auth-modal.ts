import { useState } from 'react';
import toast from 'react-hot-toast';
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
    } catch (error) {
      // TODO REMOVE IN PRODUCTION
      console.error(error);
      toast.error('Что-то пошло не так, попробуйте еще раз');
    } finally {
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
