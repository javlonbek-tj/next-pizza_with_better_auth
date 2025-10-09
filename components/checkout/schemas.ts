import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(1, 'Введите ваше имя'),
  lastName: z.string().trim().min(1, 'Введите вашу фамилию'),
  email: z
    .string()
    .trim()
    .min(1, 'Введите корректный email')
    .pipe(z.email('Введите корректный email')),
  phone: z
    .string()
    .trim()
    .regex(/^\d{2}\s\d{3}-\d{2}-\d{2}$/, 'Введите корректный номер телефона'),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
