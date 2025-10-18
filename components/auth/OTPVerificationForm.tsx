import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { verifyEmailAction, resendVerificationOTP } from '@/app/actions';
import { useOTPVerification } from '@/hooks';
import { OTP_DOWN_SECONDS } from '@/lib';

interface Props {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OTPVerificationForm({ email, onSuccess, onBack }: Props) {
  const {
    otp,
    setOtp,
    isPending,
    isResending,
    error,
    successMessage,
    countdown,
    canResend,
    handleResend,
  } = useOTPVerification({
    email,
    onSuccess,
    verifyAction: verifyEmailAction,
    resendAction: resendVerificationOTP,
    countdownSeconds: OTP_DOWN_SECONDS,
  });

  return (
    <div className='space-y-6'>
      <div className='space-y-2 text-center'>
        <p className='text-muted-foreground text-sm'>
          Мы отправили код подтверждения на
        </p>
        <p className='font-semibold text-sm'>{email}</p>
      </div>

      <div className='space-y-4'>
        <div className='flex justify-center'>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            disabled={isPending}
          >
            <InputOTPGroup className='space-x-1'>
              <InputOTPSlot index={0} className='border rounded-md' />
              <InputOTPSlot index={1} className='border rounded-md' />
              <InputOTPSlot index={2} className='border rounded-md' />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className='space-x-1'>
              <InputOTPSlot index={3} className='border rounded-md' />
              <InputOTPSlot index={4} className='border rounded-md' />
              <InputOTPSlot index={5} className='border rounded-md' />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {isPending && (
          <div className='flex justify-center items-center gap-2 text-muted-foreground text-sm'>
            <Loader className='w-4 h-4 animate-spin' />
            <span>Проверка...</span>
          </div>
        )}

        {error && (
          <p className='font-medium text-red-500 text-sm text-center'>
            {error}
          </p>
        )}
        {successMessage && (
          <p className='font-medium text-green-500 text-sm text-center'>
            {successMessage}
          </p>
        )}

        <div className='text-center'>
          {isResending ? (
            <span className='flex justify-center items-center gap-2 text-sm'>
              <Loader className='w-3 h-3 animate-spin' />
              Отправка...
            </span>
          ) : canResend ? (
            <Button
              type='button'
              variant='link'
              className='p-0 h-auto text-sm'
              onClick={handleResend}
            >
              Не получили код? Отправить повторно
            </Button>
          ) : (
            <p className='text-muted-foreground text-sm'>
              Не получили код? Отправить повторно ({countdown})
            </p>
          )}
        </div>

        <Button
          type='button'
          variant='ghost'
          className='w-full'
          onClick={onBack}
          disabled={isPending}
        >
          Назад к регистрации
        </Button>
      </div>
    </div>
  );
}
