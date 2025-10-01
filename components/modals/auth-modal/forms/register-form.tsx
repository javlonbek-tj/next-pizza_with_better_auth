import { useState } from 'react';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { registerAction } from '@/app/actions/register';

interface Props {
  onNeedsVerification: (data: { userId: string; email: string }) => void;
}

export function RegisterForm({ onNeedsVerification }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: 'dfdgg',
      email: 'test@gmail.com',
      password: '123456',
      confirmPassword: '123456',
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setIsSubmitting(true);
    setError(null);

    const result = await registerAction(values);

    if (result.error) {
      setError(result.error);
    } else if (result.needsVerification) {
      onNeedsVerification({
        userId: result.userId,
        email: values.email,
      });
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 mx-auto w-full'
        >
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>FullName</FormLabel>
                <FormControl>
                  <Input placeholder='Your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
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
              'Зарегистрироваться'
            )}
          </Button>

          {/* Success / Error messages */}
          {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
        </form>
      </Form>
    </>
  );
}
