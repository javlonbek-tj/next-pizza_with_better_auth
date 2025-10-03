import { useState, useEffect, useCallback } from 'react';
import { OTP_DOWN_SECONDS } from '@/lib';

interface Props {
  email: string;
  onSuccess: () => void;
  verifyAction: (
    email: string,
    otp: string
  ) => Promise<{ error: string | null }>;
  resendAction: (email: string) => Promise<{ error: string | null }>;
  countdownSeconds?: number;
}

export function useOTPVerification({
  email,
  onSuccess,
  verifyAction,
  resendAction,
  countdownSeconds = OTP_DOWN_SECONDS,
}: Props) {
  const [otp, setOtp] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(countdownSeconds);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-close success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleVerify = useCallback(
    async (code: string) => {
      setIsPending(true);
      setError(null);
      setSuccessMessage(null);

      const result = await verifyAction(email, code);

      if (result.error) {
        setError(result.error);
        setIsPending(false);
        setOtp('');
      } else {
        onSuccess();
      }
    },
    [email, onSuccess, verifyAction]
  );

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp, handleVerify]);

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setSuccessMessage(null);
    setOtp('');

    const result = await resendAction(email);

    if (result.error) {
      setError(result.error);
      setCountdown(0);
    } else {
      setSuccessMessage('Код подтверждения отправлен! Проверьте почту.');
      setCountdown(countdownSeconds);
    }

    setIsResending(false);
  };

  const canResend = countdown === 0 && !isResending;

  return {
    otp,
    setOtp,
    isPending,
    isResending,
    error,
    successMessage,
    countdown,
    canResend,
    handleResend,
  };
}
