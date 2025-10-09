import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Введите email')
    .pipe(z.email('Введите корректный адрес электронной почты')),

  password: z
    .string()
    .trim()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(20, 'Пароль не может превышать 20 символов'),
});

export const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .trim()
      .min(1, 'Введите имя')
      .min(2, 'Имя должно содержать минимум 2 символа')
      .max(100, 'Имя не может превышать 100 символов'),

    confirmPassword: z.string().trim().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
