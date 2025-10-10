import { z } from 'zod';

export const checkoutSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Введите ваше имя')
    .min(3, 'Имя должно содержать минимум 3 символа')
    .max(30, 'Имя не может превышать 30 символов'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Введите вашу фамилию')
    .min(3, 'Фамилия должно содержать минимум 3 символа')
    .max(30, 'Фамилия не может превышать 30 символов'),
  email: z
    .string()
    .trim()
    .min(1, 'Введите корректный email')
    .pipe(z.email('Введите корректный email')),
  phone: z
    .string()
    .trim()
    .regex(/^\d{2}\s\d{3}-\d{2}-\d{2}$/, 'Введите корректный номер телефона'),
  address: z
    .string()
    .trim()
    .min(1, 'Введите ваш адрес')
    .min(5, 'Адрес должен содержать минимум 5 символов')
    .max(100, 'Адрес не может превышать 100 символов'),
  comment: z
    .string()
    .trim()
    .max(1000, 'Комментарии не может превышать 1000 символов')
    .optional(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
