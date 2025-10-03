import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { registerSchema, RegisterValues } from './schemas';
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
import { registerAction } from '@/app/actions/register-action';
import { OTPVerificationForm } from './otp-verification-form';

interface Props {
  onClose: () => void;
  onShowOTP?: (show: boolean) => void; // Add this prop
}

export function RegisterForm({ onClose, onShowOTP }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const router = useRouter();

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
    setIsPending(true);
    setError(null);

    const result = await registerAction(values);

    if (result.error) {
      setError(result.error);
      setIsPending(false);
    } else if (result.requiresVerification && result.email) {
      setRegisteredEmail(result.email);
      setShowOTPVerification(true);
      onShowOTP?.(true); // Notify parent
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

  const handleBack = () => {
    setShowOTPVerification(false);
    onShowOTP?.(false); // Notify parent
  };

  if (showOTPVerification) {
    return (
      <OTPVerificationForm
        email={registeredEmail}
        onSuccess={handleVerificationSuccess}
        onBack={handleBack}
      />
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mx-auto w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FullName</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
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
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Confirm Password</FormLabel>
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
