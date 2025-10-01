'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle, Loader, Mail } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyCodeAction, resendCodeAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface Props {
  open: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
  userId: string;
  email?: string;
}

export function VerifyModal({
  open,
  onClose,
  onAuthSuccess,
  userId,
  email,
}: Props) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const router = useRouter();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer function
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeLeft(60);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      startTimer();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open]);

  const handleClose = () => {
    if (isLoading) return;
    setCode('');
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error('Введите 6-значный код');
      return;
    }

    setIsLoading(true);
    const result = await verifyCodeAction(userId, code);

    if (!result.success && result.error) {
      toast.error(result.error);
    }

    if (result.success) {
      setIsVerified(true);
      await signIn('credentials', {
        email,
        userId,
        skipPasswordCheck: 'true',
        redirect: false,
      });

      handleClose();
      onAuthSuccess?.();
      router.push('/');
      router.refresh();
    }

    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    const result = await resendCodeAction(userId);

    if (result.success) {
      toast.success('Новый код отправлен!');
      setCode('');
      startTimer();
    } else if (result.error) {
      toast.error(result.error);
    }

    setIsResending(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='bg-white p-7 w-[450px]'>
        <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
          <div className='mb-6 text-center'>
            <div className='flex justify-center items-center bg-blue-100 mx-auto mb-4 rounded-full w-12 h-12'>
              <Mail className='w-6 h-6 text-blue-600' />
            </div>
            <DialogTitle className='mb-2 font-semibold text-xl text-center'>
              Подтвердите email
            </DialogTitle>
            <p className='text-gray-600 text-sm'>
              Мы отправили 6-значный код на
              {email && (
                <span className='block mt-1 font-medium text-gray-800'>
                  {email}
                </span>
              )}
            </p>
          </div>

          <form onSubmit={handleVerify} className='space-y-4'>
            <div>
              <Input
                type='text'
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className='h-14 font-mono text-2xl text-center tracking-widest'
                placeholder='000000'
                autoComplete='off'
              />
            </div>

            <div className='text-sm text-center'>
              {isVerified ? (
                <p className='flex justify-center items-center gap-2 font-medium text-green-600'>
                  <CheckCircle className='w-5 h-5' />
                  <span>Email подтвержден!</span>
                </p>
              ) : !canResend ? (
                <p className='text-gray-600'>
                  Код истекает через:{' '}
                  <span className='font-mono font-bold text-red-600'>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <button
                  type='button'
                  onClick={handleResend}
                  disabled={isResending}
                  className='disabled:opacity-50 font-medium text-blue-600 hover:text-blue-700'
                >
                  {isResending ? 'Отправка...' : 'Отправить код повторно'}
                </button>
              )}
            </div>

            <Button
              type='submit'
              disabled={isLoading || code.length !== 6}
              className='w-full h-12'
            >
              {isLoading ? (
                <>
                  <Loader className='mr-2 w-4 h-4 animate-spin' />
                  Проверка...
                </>
              ) : (
                'Подтвердить'
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
