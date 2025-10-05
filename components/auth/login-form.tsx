import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
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
import { loginAction } from '@/app/actions';
import { loginSchema, LoginValues } from './schemas';
import { OTPVerificationForm } from './otp-verification-form';
import { useAuthForm } from '@/hooks';
import { useEffect } from 'react';

interface Props {
  onClose: () => void;
  onShowOTP?: (show: boolean) => void;
  onPendingChange?: (isPending: boolean) => void;
}

export function LoginForm({ onClose, onShowOTP, onPendingChange }: Props) {
  const {
    error,
    isPending,
    showOTPVerification,
    verificationEmail,
    handleAuthSubmit,
    handleVerificationSuccess,
    handleBack,
  } = useAuthForm({ onClose, onShowOTP });

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'mrjtabc@gmail.com',
      password: '123456',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    await handleAuthSubmit(() => loginAction(values), values.email);
  };

  if (showOTPVerification) {
    return (
      <OTPVerificationForm
        email={verificationEmail}
        onSuccess={handleVerificationSuccess}
        onBack={handleBack}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={`space-y-4 mx-auto w-90 ${
          isPending ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={isPending}
        >
          {isPending ? <Loader className="w-5 h-5 animate-spin" /> : 'Войти'}
        </Button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </Form>
  );
}
