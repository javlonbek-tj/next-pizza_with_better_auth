import { useState } from 'react';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    setSuccessMessage(null);

    const result = await verifyEmailAction(email, otp);

    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      onSuccess();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);
    setSuccessMessage(null);

    const result = await resendVerificationOTP(email);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMessage('Verification code sent! Check your email.');
    }
    setIsResending(false);
  };

  return (
    <div className='space-y-4'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold'>Verify your email</h2>
        <p className='text-sm text-muted-foreground'>
          We sent a verification code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Input
            placeholder='Enter 6-digit code'
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className='text-center text-2xl tracking-widest'
          />
        </div>

        <Button
          type='submit'
          className='w-full'
          disabled={isPending || otp.length !== 6}
        >
          {isPending ? (
            <Loader className='w-5 h-5 animate-spin' />
          ) : (
            'Verify Email'
          )}
        </Button>

        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        {successMessage && (
          <p className='text-green-500 text-sm text-center'>{successMessage}</p>
        )}

        <div className='flex flex-col gap-2'>
          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? (
              <Loader className='w-5 h-5 animate-spin' />
            ) : (
              "Didn't receive code? Resend"
            )}
          </Button>

          <Button
            type='button'
            variant='ghost'
            className='w-full'
            onClick={onBack}
          >
            Back to login
          </Button>
        </div>
      </form>
    </div>
  );
}
