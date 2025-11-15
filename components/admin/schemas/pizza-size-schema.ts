import { z } from 'zod';

export const pizzaSizeSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Введите название размера')
    .max(200, 'Название не должно превышать 200 символов')
    .transform((val) => val.toLowerCase())
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),

  size: z
    .number('Размер обязателен и должен быть больше 0')
    .positive('Размер обязателен и должен быть больше 0')
    .max(1000, 'Размер не должен превышать 1,000'),
});

export type PizzaSizeFormValues = z.infer<typeof pizzaSizeSchema>;
