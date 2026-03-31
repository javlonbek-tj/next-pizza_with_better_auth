'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseAuthFormOptions {
  onClose: () => void;
  onShowOTP?: (show: boolean) => void;
}

interface AuthResult {
  success: boolean;
  message?: string | null;
  error?: string | null;
  requiresVerification?: boolean;
  email?: string;
}

export function useAuthForm({ onClose, onShowOTP }: UseAuthFormOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const queryClient = useQueryClient();

  const handleAuthSubmit = async (
    authAction: () => Promise<AuthResult>,
    fallbackEmail?: string,
  ) => {
    setIsPending(true);
    setError(null);

    const result = await authAction();

    if (result.requiresVerification) {
      setVerificationEmail(result.email || fallbackEmail || '');
      setShowOTPVerification(true);
      onShowOTP?.(true);
    } else if (!result.success) {
      setError(result.message || 'Произошла ошибка. Попробуйте позже');
    } else {
      window.dispatchEvent(new Event('auth-success'));
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      onClose();
    }

    setIsPending(false);
  };

  const handleVerificationSuccess = async () => {
    window.dispatchEvent(new Event('auth-success'));
    await queryClient.invalidateQueries({ queryKey: ['cart'] });
    onClose();
  };

  const handleBack = () => {
    setShowOTPVerification(false);
    setError(null);
    setVerificationEmail('');
    setIsPending(false);
    onShowOTP?.(false);
  };

  return {
    error,
    isPending,
    showOTPVerification,
    verificationEmail,
    handleAuthSubmit,
    handleVerificationSuccess,
    handleBack,
  };
}
