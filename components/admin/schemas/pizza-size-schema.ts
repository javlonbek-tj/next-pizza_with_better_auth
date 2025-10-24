import { z } from 'zod';

export const pizzaSizeSchema = z.object({
  label: z
    .string()
    .trim()
    .min(1, 'Введите название размера')
    .max(50, 'Название не должно превышать 50 символов')
    .transform((val) => val.toLowerCase())
    .transform((val) => val.charAt(0).toUpperCase() + val.slice(1)),

  size: z
    .number('Размер должна быть числом')
    .positive('Размер должна быть больше 0')
    .max(1000, 'Размер не должна превышать 1,000'),
});

export type PizzaSizeFormValues = z.infer<typeof pizzaSizeSchema>;
