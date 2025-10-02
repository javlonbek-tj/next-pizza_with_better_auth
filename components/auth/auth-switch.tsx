'use client';

import { cn } from '@/lib';

interface AuthSwitchProps {
  className?: string;
  type: 'login' | 'register';
  onSwitch: () => void;
}

export function AuthSwitch({ className, type, onSwitch }: AuthSwitchProps) {
  return (
    <p className={cn('text-center text-sm text-gray-600', className)}>
      {type !== 'login' ? (
        <>
          Уже есть аккаунт?{' '}
          <button
            type='button'
            onClick={onSwitch}
            className='text-primary hover:underline font-medium cursor-pointer'
          >
            Войти
          </button>
        </>
      ) : (
        <>
          Нет аккаунта?{' '}
          <button
            type='button'
            onClick={onSwitch}
            className='text-primary hover:underline font-medium cursor-pointer'
          >
            Регистрация
          </button>
        </>
      )}
    </p>
  );
}
