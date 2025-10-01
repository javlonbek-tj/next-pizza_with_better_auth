import { useState } from 'react';
import { Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema, LoginValues } from './schemas';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions/login';

interface Props {
  onClose: () => void;
  onNeedsVerification: (data: { userId: string; email: string }) => void;
}

export function LoginForm({ onClose, onNeedsVerification }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test@gmail.com',
      password: '123456',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1) Pre-check credentials with server action
      const pre = await loginAction(values);

      if (!pre.success) {
        if (pre.needsVerification && pre.userId) {
          onNeedsVerification({
            userId: pre.userId,
            email: values.email,
          });
          setIsSubmitting(false);
          return;
        }

        setError(pre.error ?? 'Неверный email или пароль');
        return;
      }

      // 2) If pre-check succeeded, call next-auth signIn to establish session
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Неверный email или пароль');
        } else {
          setError('Произошла ошибка. Пожалуйста, попробуйте ещё раз.');
        }
        return;
      }

      if (result?.ok) {
        onClose?.();
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      // TODO REMOVE IN PRODUCTION
      console.error('Error [LOGIN]', error);
      setError('Произошла ошибка. Пожалуйста, попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 mx-auto w-90'
        >
          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='you@example.com'
                    type='email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='******' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full cursor-pointer'
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader className='w-5 h-5 animate-spin' />
            ) : (
              'Войти'
            )}
          </Button>

          {/* Messages */}
          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        </form>
      </Form>
    </>
  );
}
