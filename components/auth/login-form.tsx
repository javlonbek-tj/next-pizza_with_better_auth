import { useState } from 'react';
import { Loader } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/app/actions';
import { loginSchema, LoginValues } from './schemas';
import { OTPVerificationForm } from './otp-verification-form';

interface Props {
  onClose: () => void;
}

export function LoginForm({ onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const router = useRouter();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsPending(true);
    setError(null);

    const result = await loginAction(values);

    if (result.requiresVerification) {
      setUnverifiedEmail(result.email || values.email);
      setShowOTPVerification(true);
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

  if (showOTPVerification) {
    return (
      <OTPVerificationForm
        email={unverifiedEmail}
        onSuccess={handleVerificationSuccess}
        onBack={() => setShowOTPVerification(false)}
      />
    );
  }

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
            disabled={isPending}
          >
            {isPending ? <Loader className='w-5 h-5 animate-spin' /> : 'Войти'}
          </Button>

          {/* Messages */}
          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        </form>
      </Form>
    </>
  );
}
