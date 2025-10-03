import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseAuthFormOptions {
  onClose: () => void;
  onShowOTP?: (show: boolean) => void;
}

interface AuthResult {
  error: string | null;
  requiresVerification?: boolean;
  email?: string;
}

export function useAuthForm({ onClose, onShowOTP }: UseAuthFormOptions) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const router = useRouter();

  const handleAuthSubmit = async (
    authAction: () => Promise<AuthResult>,
    fallbackEmail?: string
  ) => {
    setIsPending(true);
    setError(null);

    const result = await authAction();

    if (result.requiresVerification) {
      setVerificationEmail(result.email || fallbackEmail || '');
      setShowOTPVerification(true);
      onShowOTP?.(true);
      setIsPending(false);
    } else if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      onClose();
      router.push('/');
    }
  };

  const handleVerificationSuccess = () => {
    onClose();
    router.push('/');
  };

  const handleBack = () => {
    setShowOTPVerification(false);
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
