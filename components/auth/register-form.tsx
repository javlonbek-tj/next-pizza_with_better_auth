import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerAction } from '@/app/actions';
import { registerSchema, RegisterValues } from './schemas';
import { OTPVerificationForm } from './otp-verification-form';
import { useAuthForm } from '@/hooks/use-auth-form';

interface Props {
  onClose: () => void;
  onShowOTP?: (show: boolean) => void;
  onPendingChange?: (isPending: boolean) => void;
}

export function RegisterForm({ onClose, onShowOTP, onPendingChange }: Props) {
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

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    await handleAuthSubmit(() => registerAction(values), values.email);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Полное имя</FormLabel>
              <FormControl>
                <Input placeholder="Ваше имя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите пароль</FormLabel>
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
          {isPending ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            'Зарегистрироваться'
          )}
        </Button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </Form>
  );
}
