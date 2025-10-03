import { useState, useEffect, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { verifyEmailAction } from '@/app/actions/verify-email-action';
import { resendVerificationOTP } from '@/app/actions/resend-verification-otp';

interface Props {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OTPVerificationForm({ email, onSuccess, onBack }: Props) {
  const [otp, setOtp] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10); // 60 seconds countdown

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Wrap handleVerify in useCallback
  const handleVerify = useCallback(
    async (code: string) => {
      setIsPending(true);
      setError(null);
      setSuccessMessage(null);

      const result = await verifyEmailAction(email, code);

      if (result.error) {
        setError(result.error);
        setIsPending(false);
        setOtp('');
      } else {
        onSuccess();
      }
    },
    [email, onSuccess]
  ); // Dependencies: email and onSuccess

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp, handleVerify]); // Now handleVerify is stable

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setSuccessMessage(null);
    setOtp('');

    const result = await resendVerificationOTP(email);

    if (result.error) {
      setError(result.error);
      setCountdown(0); // Allow immediate retry on error
    } else {
      setCountdown(10); // Reset countdown ONLY on success
    }

    setIsResending(false);
  };

  const canResend = countdown === 0 && !isResending;

  return (
  <div className="space-y-6">
    <div className="space-y-2 text-center">
      <p className="text-muted-foreground text-sm">
        Мы отправили код подтверждения на
      </p>
      <p className="font-semibold text-sm">{email}</p>
    </div>

    <div className="space-y-4">
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
          disabled={isPending}
        >
          <InputOTPGroup className="space-x-1">
            <InputOTPSlot index={0} className="border rounded-md" />
            <InputOTPSlot index={1} className="border rounded-md" />
            <InputOTPSlot index={2} className="border rounded-md" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup className="space-x-1">
            <InputOTPSlot index={3} className="border rounded-md" />
            <InputOTPSlot index={4} className="border rounded-md" />
            <InputOTPSlot index={5} className="border rounded-md" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {isPending && (
        <div className="flex justify-center items-center gap-2 text-muted-foreground text-sm">
          <Loader className="w-4 h-4 animate-spin" />
          <span>Проверка...</span>
        </div>
      )}

      {error && (
        <p className="font-medium text-red-500 text-sm text-center">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="font-medium text-green-500 text-sm text-center">
          {successMessage}
        </p>
      )}

      <div className="text-center">
        {isResending ? (
          <span className="flex justify-center items-center gap-2 text-sm">
            <Loader className="w-3 h-3 animate-spin" />
            Отправка...
          </span>
        ) : canResend ? (
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm"
            onClick={handleResend}
          >
            Не получили код? Отправить повторно
          </Button>
        ) : (
          <p className="text-muted-foreground text-sm">
            Не получили код? Отправить повторно ({countdown})
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onBack}
        disabled={isPending}
      >
        Назад к {onBack.name.includes('login') ? 'входу' : 'регистрации'}
      </Button>
    </div>
  </div>
);